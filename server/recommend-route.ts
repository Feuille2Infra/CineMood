import OpenAI from "openai";
import { NextResponse } from "next/server";
import { defaultFilters, localRecommend, type DiscoveryFilters } from "@/lib/recommendation-engine";
import { getLetterboxdRecommendations } from "@/server/letterboxd";
import { getAvailability } from "@/server/streaming";

type Mood = {
  stress: number;
  happiness: number;
  complexity: number;
  pace: number;
};

type RecommendRequest = {
  mood: Mood;
  platforms: string[];
  skipped: string[];
  filters?: DiscoveryFilters;
};

type MovieResult = {
  id: string;
  title: string;
  year: string;
  countries: string[];
  sourceLists: string[];
  poster: string;
  overview: string;
  matchReason: string;
  provider: string;
  availability: string[];
  watchUrl: string;
  rating: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RecommendRequest;
  const mood = normalizeMood(body.mood);
  const platforms = Array.isArray(body.platforms) ? body.platforms : [];
  const skipped = new Set(Array.isArray(body.skipped) ? body.skipped : []);
  const filters = normalizeFilters(body.filters);
  const localResults = localRecommend(mood, platforms, [...skipped], filters);
  const letterboxdResults = await getLetterboxdRecommendations({
    mood,
    filters,
    platforms,
    skipped: [...skipped]
  });
  const canUseLiveDiscovery = Boolean(getTmdbCredential()) && (platforms.length === 0 || Boolean(process.env.WATCHMODE_API_KEY));

  const querySpec = await createQuerySpec(mood, platforms, filters);
  const liveMovies = canUseLiveDiscovery
    ? await searchTmdb(querySpec, platforms, skipped)
    : [];
  const response =
    liveMovies.length
      ? { query: querySpec.query, movies: liveMovies }
      : letterboxdResults?.movies.length
        ? letterboxdResults
        : localResults.movies.length
          ? localResults
          : { query: querySpec.query, movies: liveMovies };

  return NextResponse.json({
    query: response.query,
    movies: response.movies
  });
}

function normalizeMood(mood: Mood): Mood {
  return {
    stress: clamp(mood?.stress ?? 50),
    happiness: clamp(mood?.happiness ?? 50),
    complexity: clamp(mood?.complexity ?? 50),
    pace: clamp(mood?.pace ?? 50)
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function normalizeFilters(filters?: DiscoveryFilters): DiscoveryFilters {
  return {
    country: filters?.country || defaultFilters.country,
    era: filters?.era || defaultFilters.era,
    obscurity: clamp(filters?.obscurity ?? defaultFilters.obscurity)
  };
}

async function createQuerySpec(mood: Mood, platforms: string[], filters: DiscoveryFilters) {
  const fallback = localQuerySpec(mood, filters);

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You convert emotional movie slider values into a concise TMDB discovery strategy. Return only JSON."
        },
        {
          role: "user",
          content: JSON.stringify({
            mood,
            platforms,
            filters,
            schema: {
              query: "short natural-language movie taste description",
              keywords: "3-6 search keywords",
              minVoteAverage: "number 5.5-8.5",
              sortBy: "popularity.desc or vote_average.desc or revenue.desc",
              genres: "comma-separated TMDB genre ids if useful",
              country: "origin country code if useful",
              yearFrom: "optional year floor",
              yearTo: "optional year ceiling"
            }
          })
        }
      ],
      temperature: 0.7
    });

    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}") as Partial<ReturnType<typeof localQuerySpec>>;
    return {
      ...fallback,
      ...parsed,
      minVoteAverage: Number(parsed.minVoteAverage || fallback.minVoteAverage)
    };
  } catch {
    return fallback;
  }
}

function localQuerySpec(mood: Mood, filters: DiscoveryFilters) {
  const genres = [];
  if (mood.stress > 68) genres.push("53");
  if (mood.happiness > 65) genres.push("35", "10751");
  if (mood.complexity > 65) genres.push("9648", "878");
  if (mood.pace > 65) genres.push("28", "12");
  const [yearFrom, yearTo] = eraToRange(filters.era);

  return {
    query: `${mood.happiness > 60 ? "uplifting" : "moody"} ${mood.pace > 60 ? "fast-paced" : "slow-burn"} movies with ${
      mood.complexity > 60 ? "layered plots" : "clear emotional arcs"
    }${filters.country !== "any" ? ` from ${filters.country}` : ""}${filters.era !== "any" ? ` in the ${filters.era}` : ""}${
      filters.obscurity > 60 ? " with deep-cut taste" : ""
    }`,
    keywords: mood.complexity > 60 ? "mystery,twist,psychological" : "feel-good,journey,heartfelt",
    minVoteAverage: mood.stress > 70 ? 6.2 : 6.8,
    sortBy: filters.obscurity > 68 ? "vote_average.desc" : mood.complexity > 70 ? "vote_average.desc" : "popularity.desc",
    genres: genres.join(","),
    country: filters.country !== "any" ? filters.country : "",
    yearFrom,
    yearTo,
    voteCountGte: filters.obscurity > 82 ? 8 : filters.obscurity > 68 ? 20 : filters.obscurity > 45 ? 120 : 250,
    pageWindow: filters.obscurity > 82 ? [5, 9] : filters.obscurity > 68 ? [3, 7] : filters.obscurity > 45 ? [2, 5] : [1, 3]
  };
}

async function searchTmdb(
  spec: ReturnType<typeof localQuerySpec>,
  platforms: string[],
  skipped: Set<string>
): Promise<MovieResult[]> {
  const auth = getTmdbAuth();
  if (!auth) {
    return [];
  }

  const params = new URLSearchParams({
    language: "en-US",
    sort_by: spec.sortBy,
    "vote_count.gte": String(spec.voteCountGte),
    "vote_average.gte": String(spec.minVoteAverage),
    include_adult: "false"
  });

  for (const [key, value] of Object.entries(auth.queryParams)) {
    params.set(key, value);
  }

  if (spec.genres) {
    params.set("with_genres", spec.genres);
  }
  if (spec.country) {
    params.set("with_origin_country", spec.country);
  }
  if (spec.yearFrom) {
    params.set("primary_release_date.gte", `${spec.yearFrom}-01-01`);
  }
  if (spec.yearTo) {
    params.set("primary_release_date.lte", `${spec.yearTo}-12-31`);
  }

  const [pageFrom, pageTo] = spec.pageWindow;
  const pages = Array.from({ length: pageTo - pageFrom + 1 }, (_, index) => pageFrom + index);
  const responses = await Promise.all(
    pages.map(async (page) => {
      const pageParams = new URLSearchParams(params);
      pageParams.set("page", String(page));

      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${pageParams.toString()}`, {
        headers: auth.headers,
        next: { revalidate: 1800 }
      });

      if (!response.ok) {
        return [];
      }

      const data = (await response.json()) as {
        results: Array<{
          id: number;
          title: string;
          release_date?: string;
          poster_path?: string;
          overview?: string;
          vote_average?: number;
          genre_ids?: number[];
        }>;
      };

      return data.results;
    })
  );

  const candidates = selectTmdbCandidates(
    responses.flat().filter((movie) => movie.poster_path && !skipped.has(String(movie.id))),
    spec
  );

  const enriched = await Promise.all(
    candidates.map(async (movie) => {
      const availability = await getAvailability(movie.title, platforms);
      return {
        id: String(movie.id),
        title: movie.title,
        year: movie.release_date?.slice(0, 4) || "Movie",
        countries: spec.country ? [spec.country] : [],
        sourceLists: process.env.OPENAI_API_KEY ? ["TMDB Discover", "OpenAI Mood Query"] : ["TMDB Discover"],
        poster: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
        overview: movie.overview || "",
        matchReason: buildReason(spec),
        provider: availability.provider,
        availability: availability.availability,
        watchUrl: availability.watchUrl,
        rating: movie.vote_average || 0
      };
    })
  );

  return enriched;
}

function buildReason(spec: ReturnType<typeof localQuerySpec>) {
  return `Matched for ${spec.query.toLowerCase()} with ${spec.keywords.replaceAll(",", ", ")} signals.`;
}

function selectTmdbCandidates(
  movies: Array<{
    id: number;
    title: string;
    release_date?: string;
    poster_path?: string;
    overview?: string;
    vote_average?: number;
    genre_ids?: number[];
  }>,
  spec: ReturnType<typeof localQuerySpec>
) {
  const picked: typeof movies = [];
  const seenIds = new Set<number>();
  const seenGenres = new Map<number, number>();

  for (const movie of movies) {
    if (seenIds.has(movie.id)) {
      continue;
    }

    const genrePenalty = (movie.genre_ids || []).reduce((total, genreId) => total + (seenGenres.get(genreId) || 0), 0);
    const prefersObscureSpread = spec.voteCountGte <= 20;
    const canTake = prefersObscureSpread ? genrePenalty < 4 : genrePenalty < 7;

    if (!canTake && picked.length < 8) {
      continue;
    }

    seenIds.add(movie.id);
    picked.push(movie);

    for (const genreId of movie.genre_ids || []) {
      seenGenres.set(genreId, (seenGenres.get(genreId) || 0) + 1);
    }

    if (picked.length >= 12) {
      break;
    }
  }

  return picked;
}

function getTmdbCredential() {
  return process.env.TMDB_BEARER_TOKEN || process.env.TMDB_API_KEY || "";
}

type TmdbAuth = {
  headers: Record<string, string>;
  queryParams: Record<string, string>;
};

function getTmdbAuth(): TmdbAuth | null {
  const raw = getTmdbCredential();
  if (!raw) {
    return null;
  }

  const isBearer = raw.startsWith("eyJ") || raw.includes(".") || raw.startsWith("tmdb_");
  return isBearer
    ? {
        headers: {
          Authorization: `Bearer ${raw}`,
          accept: "application/json"
        },
        queryParams: {}
      }
    : {
        headers: {
          accept: "application/json"
        },
        queryParams: {
          api_key: raw
        }
      };
}

function eraToRange(era: string) {
  if (era === "any") {
    return ["", ""];
  }

  if (era === "pre-1970") {
    return ["1900", "1969"];
  }

  if (era === "2020s") {
    return ["2020", "2029"];
  }

  const decade = Number(era.slice(0, 4));
  if (!decade) {
    return ["", ""];
  }

  return [String(decade), String(decade + 9)];
}
