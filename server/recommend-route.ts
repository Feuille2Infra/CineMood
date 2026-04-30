import OpenAI from "openai";
import { NextResponse } from "next/server";

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
};

type MovieResult = {
  id: string;
  title: string;
  year: string;
  poster: string;
  overview: string;
  matchReason: string;
  provider: string;
  watchUrl: string;
  rating: number;
};

const fallbackMovies: MovieResult[] = [
  {
    id: "603",
    title: "The Matrix",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    overview: "A hacker discovers reality is far stranger and more dangerous than it appears.",
    matchReason: "A kinetic, high-concept match for fast pacing and layered stakes.",
    provider: "Max",
    watchUrl: "https://www.justwatch.com/us/movie/the-matrix",
    rating: 8.2
  },
  {
    id: "496243",
    title: "Parasite",
    year: "2019",
    poster: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    overview: "A dark social thriller where one family's plan turns into a volatile collision.",
    matchReason: "Tense, clever, and emotionally unpredictable without dragging.",
    provider: "Hulu",
    watchUrl: "https://www.justwatch.com/us/movie/parasite-2019",
    rating: 8.5
  },
  {
    id: "550",
    title: "Fight Club",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    overview: "A restless office worker is pulled into an anarchic underground world.",
    matchReason: "Stress-heavy, sharp-edged, and built around a twisty identity puzzle.",
    provider: "Prime Video",
    watchUrl: "https://www.justwatch.com/us/movie/fight-club",
    rating: 8.4
  }
];

export async function POST(request: Request) {
  const body = (await request.json()) as RecommendRequest;
  const mood = normalizeMood(body.mood);
  const platforms = Array.isArray(body.platforms) ? body.platforms : [];
  const skipped = new Set(Array.isArray(body.skipped) ? body.skipped : []);

  const querySpec = await createQuerySpec(mood, platforms);
  const movies = process.env.TMDB_API_KEY
    ? await searchTmdb(querySpec, platforms, skipped)
    : fallbackMovies.filter((movie) => !skipped.has(movie.id));

  return NextResponse.json({
    query: querySpec.query,
    movies: movies.length ? movies : fallbackMovies.filter((movie) => !skipped.has(movie.id))
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

async function createQuerySpec(mood: Mood, platforms: string[]) {
  const fallback = localQuerySpec(mood);

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
            schema: {
              query: "short natural-language movie taste description",
              keywords: "3-6 search keywords",
              minVoteAverage: "number 5.5-8.5",
              sortBy: "popularity.desc or vote_average.desc or revenue.desc",
              genres: "comma-separated TMDB genre ids if useful"
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

function localQuerySpec(mood: Mood) {
  const genres = [];
  if (mood.stress > 68) genres.push("53");
  if (mood.happiness > 65) genres.push("35", "10751");
  if (mood.complexity > 65) genres.push("9648", "878");
  if (mood.pace > 65) genres.push("28", "12");

  return {
    query: `${mood.happiness > 60 ? "uplifting" : "moody"} ${mood.pace > 60 ? "fast-paced" : "slow-burn"} movies with ${
      mood.complexity > 60 ? "layered plots" : "clear emotional arcs"
    }`,
    keywords: mood.complexity > 60 ? "mystery,twist,psychological" : "feel-good,journey,heartfelt",
    minVoteAverage: mood.stress > 70 ? 6.4 : 6.8,
    sortBy: mood.complexity > 70 ? "vote_average.desc" : "popularity.desc",
    genres: genres.join(",")
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
    "vote_count.gte": "250",
    "vote_average.gte": String(spec.minVoteAverage),
    include_adult: "false",
    page: "1"
  });

  if (spec.genres) {
    params.set("with_genres", spec.genres);
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
        poster: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
        overview: movie.overview || "",
        matchReason: buildReason(spec),
        provider: availability.provider,
        watchUrl: availability.watchUrl,
        rating: movie.vote_average || 0
      };
    })
  );

  return enriched;
}

async function getAvailability(title: string, platforms: string[]) {
  const fallbackProvider = platforms[0] || "JustWatch";
  const fallback = {
    provider: fallbackProvider,
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

    return {
      provider: preferred?.name || fallback.provider,
      watchUrl: preferred?.web_url || fallback.watchUrl
    };
  } catch {
    return fallback;
  }
}

function buildReason(spec: ReturnType<typeof localQuerySpec>) {
  return `Matched for ${spec.query.toLowerCase()} with ${spec.keywords.replaceAll(",", ", ")} signals.`;
}
