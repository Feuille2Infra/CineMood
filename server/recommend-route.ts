import OpenAI from "openai";
import { NextResponse } from "next/server";
import { defaultFilters, localRecommend, type DiscoveryFilters } from "@/lib/recommendation-engine";

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
  const canUseLiveDiscovery = Boolean(process.env.TMDB_API_KEY) && (platforms.length === 0 || Boolean(process.env.WATCHMODE_API_KEY));

  const querySpec = await createQuerySpec(mood, platforms, filters);
  const liveMovies = canUseLiveDiscovery
    ? await searchTmdb(querySpec, platforms, skipped)
    : [];
  const movies = localResults.movies.length ? localResults.movies : liveMovies;

  return NextResponse.json({
    query: localResults.query,
    movies
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
    voteCountGte: filters.obscurity > 70 ? 40 : filters.obscurity > 45 ? 120 : 250
  };
}

async function searchTmdb(
  spec: ReturnType<typeof localQuerySpec>,
  platforms: string[],
  skipped: Set<string>
): Promise<MovieResult[]> {
  const params = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY || "",
    language: "en-US",
    sort_by: spec.sortBy,
    "vote_count.gte": String(spec.voteCountGte),
    "vote_average.gte": String(spec.minVoteAverage),
    include_adult: "false",
    page: "1"
  });

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

  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`, {
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
    }>;
  };

  const candidates = data.results
    .filter((movie) => movie.poster_path && !skipped.has(String(movie.id)))
    .slice(0, 12);

  const enriched = await Promise.all(
    candidates.map(async (movie) => {
      const availability = await getAvailability(movie.title, platforms);
      return {
        id: String(movie.id),
        title: movie.title,
        year: movie.release_date?.slice(0, 4) || "Movie",
        countries: spec.country ? [spec.country] : [],
        sourceLists: ["TMDB discovery fallback"],
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

async function getAvailability(title: string, platforms: string[]) {
  const fallbackProvider = "JustWatch";
  const fallback = {
    provider: fallbackProvider,
    availability: [fallbackProvider],
    watchUrl: `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`
  };

  if (!process.env.WATCHMODE_API_KEY) {
    return fallback;
  }

  try {
    const search = new URLSearchParams({
      apiKey: process.env.WATCHMODE_API_KEY,
      search_field: "name",
      search_value: title
    });
    const searchResponse = await fetch(`https://api.watchmode.com/v1/search/?${search.toString()}`);
    if (!searchResponse.ok) return fallback;

    const searchData = (await searchResponse.json()) as { title_results?: Array<{ id: number }> };
    const watchmodeId = searchData.title_results?.[0]?.id;
    if (!watchmodeId) return fallback;

    const sourcesResponse = await fetch(
      `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${process.env.WATCHMODE_API_KEY}`
    );
    if (!sourcesResponse.ok) return fallback;

    const sources = (await sourcesResponse.json()) as Array<{ name?: string; web_url?: string; type?: string }>;
    const preferred =
      sources.find((source) => source.name && platforms.includes(source.name) && source.type === "sub") ||
      sources.find((source) => source.name && platforms.includes(source.name)) ||
      sources[0];
    const filteredSources = platforms.length
      ? sources.filter((source) => source.name && platforms.includes(source.name))
      : sources;
    const names = filteredSources
      .map((source) => source.name)
      .filter((name): name is string => Boolean(name))
      .slice(0, 3);

    return {
      provider: preferred?.name || fallback.provider,
      availability: names.length ? names : [preferred?.name || fallback.provider],
      watchUrl: preferred?.web_url || fallback.watchUrl
    };
  } catch {
    return fallback;
  }
}

function buildReason(spec: ReturnType<typeof localQuerySpec>) {
  return `Matched for ${spec.query.toLowerCase()} with ${spec.keywords.replaceAll(",", ", ")} signals.`;
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
