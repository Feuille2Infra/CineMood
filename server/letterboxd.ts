import { type DiscoveryFilters, type Mood, type Movie, type SearchResponse } from "@/lib/recommendation-engine";
import { getAvailability } from "@/server/streaming";

type LetterboxdFilm = {
  id: string;
  name: string;
  releaseYear?: number;
  rating?: number;
  top250Position?: number | null;
  poster?: { sizes?: Array<{ width: number; height: number; url: string }> };
  genres?: Array<{ id: string; name: string }>;
  directors?: Array<{ id: string; name: string }>;
};

type LetterboxdList = {
  id: string;
  name: string;
};

type SeedFilm = {
  id: string;
  title: string;
  year: string;
  poster: string;
  rating: number;
  genres: string[];
  countries: string[];
  sourceLists: string[];
  moodProfile: Mood;
  obscurity: number;
};

type OAuthToken = {
  access_token: string;
  expires_in: number;
};

const LETTERBOXD_API_BASE = "https://api.letterboxd.com/api/v0";
const OFFICIAL_ACCOUNT_URL = "https://letterboxd.com/official/";
const DEFAULT_USERNAME = "Feuille2Cedric";
const OFFICIAL_LIST_NAMES = [
  "Letterboxd's Top 500 Films",
  "Top 100 Underseen Films",
  "Top 50 Underseen Horror Films",
  "Top 250 Science Fiction Films",
  "Top 100 Japanese Films",
  "Top 100 South Korean Films",
  "Top 100 Italian Films",
  "Top 100 Taiwanese Films",
  "Top 100 Anime Films"
];

let tokenCache: { value: string; expiresAt: number } | null = null;
let poolCache: { value: SeedFilm[]; expiresAt: number } | null = null;

export async function getLetterboxdRecommendations(args: {
  mood: Mood;
  filters: DiscoveryFilters;
  platforms: string[];
  skipped: string[];
}): Promise<SearchResponse | null> {
  if (!process.env.LETTERBOXD_CLIENT_ID || !process.env.LETTERBOXD_CLIENT_SECRET) {
    return null;
  }

  const poolData = await getSeedPool();
  if (!poolData?.length) {
    return null;
  }

  const skippedSet = new Set(args.skipped);
  const ranked = poolData
    .filter((movie) => !skippedSet.has(movie.id))
    .filter((movie) => matchesCountry(movie.countries, args.filters.country))
    .filter((movie) => matchesEra(movie.year, args.filters.era))
    .filter((movie) => matchesObscurity(movie.obscurity, args.filters.obscurity))
    .map((movie) => ({
      movie,
      score: scoreMovie(movie, args.mood, args.filters)
    }))
    .sort((left, right) => right.score - left.score);

  const enriched: Movie[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < ranked.length && enriched.length < 10; index += 18) {
    const chunk = ranked.slice(index, index + 18);
    const resolved = await Promise.all(chunk.map(({ movie }) => enrichMovie(movie, args.mood, args.platforms)));

    for (const movie of resolved) {
      if (!movie || seen.has(movie.id)) {
        continue;
      }
      if (args.platforms.length && !movie.availability.some((platform) => args.platforms.includes(platform))) {
        continue;
      }

      seen.add(movie.id);
      enriched.push(movie);

      if (enriched.length >= 10) {
        break;
      }
    }
  }

  if (!enriched.length) {
    return null;
  }

  return {
    query: buildLetterboxdQuery(args.filters, args.platforms, poolData.length),
    movies: enriched
  };
}

async function getSeedPool() {
  if (poolCache && poolCache.expiresAt > Date.now()) {
    return poolCache.value;
  }

  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  const [officialMemberId, userMemberId] = await Promise.all([
    getWebsiteIdentifier(OFFICIAL_ACCOUNT_URL),
    getWebsiteIdentifier(`https://letterboxd.com/${process.env.LETTERBOXD_USERNAME || DEFAULT_USERNAME}/`)
  ]);

  if (!officialMemberId && !userMemberId) {
    return null;
  }

  const [officialLists, userLists] = await Promise.all([
    officialMemberId ? getListsForMember(token, officialMemberId) : Promise.resolve([]),
    userMemberId ? getListsForMember(token, userMemberId) : Promise.resolve([])
  ]);

  const selectedOfficialLists = officialLists.filter((list) => OFFICIAL_LIST_NAMES.includes(list.name));
  const selectedUserLists = userLists
    .slice()
    .sort((left, right) => getUserListPriority(right.name) - getUserListPriority(left.name))
    .slice(0, 12);

  const seedLists = [...selectedOfficialLists, ...selectedUserLists];
  const seedEntries = await Promise.all(
    seedLists.map(async (list) => ({
      list,
      entries: await getListEntries(token, list.id)
    }))
  );
  const pool = new Map<string, SeedFilm>();

  for (const { list, entries } of seedEntries) {
    for (const film of entries) {
      const poster = pickPosterUrl(film.poster);
      if (!poster) {
        continue;
      }

      const current = pool.get(film.id);
      const countries = inferCountries(list.name);
      const sourceLists = current ? [...current.sourceLists] : [];
      if (!sourceLists.includes(list.name)) {
        sourceLists.push(list.name);
      }

      const nextMoodProfile = blendMoodProfiles(current?.moodProfile, inferMoodProfile(film, list.name), sourceLists.length);
      const nextCountries = [...new Set([...(current?.countries || []), ...countries])];
      const nextGenres = [...new Set([...(current?.genres || []), ...(film.genres || []).map((genre) => genre.name.toLowerCase())])];
      const nextObscurity = Math.max(current?.obscurity || 0, inferObscurity(list.name, film));

      pool.set(film.id, {
        id: film.id,
        title: film.name,
        year: film.releaseYear ? String(film.releaseYear) : "Movie",
        poster,
        rating: Number(((film.rating || 0) * 2).toFixed(1)),
        genres: nextGenres,
        countries: nextCountries,
        sourceLists,
        moodProfile: nextMoodProfile,
        obscurity: nextObscurity
      });
    }
  }

  const value = [...pool.values()];
  poolCache = {
    value,
    expiresAt: Date.now() + 1000 * 60 * 60 * 6
  };

  return value;
}

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.value;
  }

  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.LETTERBOXD_CLIENT_ID || "",
      client_secret: process.env.LETTERBOXD_CLIENT_SECRET || ""
    });

    const response = await fetch(`${LETTERBOXD_API_BASE}/auth/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body,
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OAuthToken;
    tokenCache = {
      value: data.access_token,
      expiresAt: Date.now() + Math.max(data.expires_in - 120, 300) * 1000
    };

    return data.access_token;
  } catch {
    return null;
  }
}

async function apiGet<T>(token: string, path: string, params?: Record<string, string>) {
  const url = new URL(`${LETTERBOXD_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params || {})) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    next: { revalidate: 21600 }
  });

  if (!response.ok) {
    throw new Error(`Letterboxd request failed for ${path}`);
  }

  return (await response.json()) as T;
}

async function getWebsiteIdentifier(url: string) {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      next: { revalidate: 21600 }
    });
    const headerValue = head.headers.get("x-letterboxd-identifier");
    if (headerValue) {
      return headerValue;
    }

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      next: { revalidate: 21600 }
    });
    return response.headers.get("x-letterboxd-identifier");
  } catch {
    return null;
  }
}

async function getListsForMember(token: string, memberId: string) {
  const response = await apiGet<{ items?: Array<{ id: string; name: string }> }>(token, "/lists", {
    member: memberId,
    memberRelationship: "Owner",
    where: "Published",
    perPage: "100",
    sort: "WhenPublishedLatestFirst"
  });

  return (response.items || []).map((item) => ({
    id: item.id,
    name: item.name
  }));
}

async function getListEntries(token: string, listId: string) {
  const items: LetterboxdFilm[] = [];
  let cursor = "";

  while (items.length < 220) {
    const response = await apiGet<{
      next?: string;
      items?: Array<{ film: LetterboxdFilm }>;
    }>(token, `/list/${listId}/entries`, {
      perPage: "100",
      cursor
    });

    const films = (response.items || []).map((entry) => entry.film).filter(Boolean);
    items.push(...films);

    if (!response.next) {
      break;
    }

    cursor = response.next;
  }

  return items;
}

async function enrichMovie(seed: SeedFilm, mood: Mood, platforms: string[]): Promise<Movie | null> {
  const availability = await getAvailability(seed.title, platforms);

  return {
    id: seed.id,
    title: seed.title,
    year: seed.year,
    countries: seed.countries,
    sourceLists: seed.sourceLists,
    poster: seed.poster,
    overview: `Pulled from ${seed.sourceLists.slice(0, 2).join(" and ")}.`,
    matchReason: buildMatchReason(seed, mood),
    provider: availability.provider,
    availability: availability.availability,
    watchUrl: availability.watchUrl,
    rating: seed.rating
  };
}

function pickPosterUrl(poster?: { sizes?: Array<{ width: number; height: number; url: string }> }) {
  if (!poster?.sizes?.length) {
    return "";
  }

  const sorted = [...poster.sizes].sort((left, right) => right.width - left.width);
  return sorted.find((size) => size.width >= 600)?.url || sorted[0]?.url || "";
}

function getUserListPriority(name: string) {
  const value = name.toLowerCase();
  let score = 0;

  if (value.includes("top")) score += 14;
  if (value.includes("cigaret")) score += 18;
  if (value.includes("best") || value.includes("favorite")) score += 12;
  if (value.includes("2026") || value.includes("2025")) score += 10;

  return score;
}

function inferMoodProfile(film: LetterboxdFilm, sourceList: string): Mood {
  const mood: Mood = {
    stress: 46,
    happiness: 46,
    complexity: 50,
    pace: 48
  };

  for (const genre of film.genres || []) {
    const name = genre.name.toLowerCase();

    if (name === "action") {
      mood.stress += 24;
      mood.pace += 28;
    } else if (name === "thriller") {
      mood.stress += 28;
      mood.pace += 14;
      mood.happiness -= 12;
    } else if (name === "horror") {
      mood.stress += 34;
      mood.pace += 10;
      mood.happiness -= 18;
    } else if (name === "comedy") {
      mood.happiness += 24;
      mood.stress -= 14;
      mood.pace += 8;
    } else if (name === "family" || name === "animation") {
      mood.happiness += 18;
      mood.stress -= 18;
    } else if (name === "mystery") {
      mood.complexity += 24;
      mood.stress += 8;
    } else if (name === "science fiction") {
      mood.complexity += 22;
      mood.pace += 8;
    } else if (name === "crime") {
      mood.stress += 16;
      mood.complexity += 12;
    } else if (name === "romance") {
      mood.happiness += 8;
      mood.pace -= 8;
    } else if (name === "war") {
      mood.stress += 18;
      mood.happiness -= 12;
    } else if (name === "drama") {
      mood.complexity += 6;
      mood.happiness -= 4;
    } else if (name === "fantasy") {
      mood.happiness += 10;
      mood.complexity += 10;
    }
  }

  const source = sourceList.toLowerCase();
  if (source.includes("underseen")) {
    mood.complexity += 10;
    mood.pace -= 8;
  }
  if (source.includes("science fiction")) {
    mood.complexity += 8;
  }
  if (source.includes("cigaret")) {
    mood.happiness -= 10;
    mood.pace -= 10;
    mood.complexity += 8;
  }

  return {
    stress: clamp(mood.stress),
    happiness: clamp(mood.happiness),
    complexity: clamp(mood.complexity),
    pace: clamp(mood.pace)
  };
}

function inferObscurity(sourceList: string, film: LetterboxdFilm) {
  const source = sourceList.toLowerCase();
  let obscurity = 34;

  if (source.includes("underseen")) obscurity += 38;
  if (source.includes("top 50")) obscurity += 10;
  if (source.includes("top 100")) obscurity += 8;
  if (source.includes("science fiction")) obscurity += 4;
  if (source.includes("feuille2cedric")) obscurity += 18;
  if (source.includes("most fans") || source.includes("top 500")) obscurity -= 16;
  if (typeof film.top250Position === "number") obscurity -= 10;
  if ((film.releaseYear || 0) < 1980) obscurity += 8;
  if ((film.rating || 0) >= 4.2) obscurity += 4;

  return clamp(obscurity);
}

function inferCountries(sourceList: string) {
  const source = sourceList.toLowerCase();

  if (source.includes("japanese")) return ["JP"];
  if (source.includes("south korean")) return ["KR"];
  if (source.includes("italian")) return ["IT"];
  if (source.includes("taiwanese")) return ["TW"];
  if (source.includes("french")) return ["FR"];
  if (source.includes("hong kong")) return ["HK"];
  if (source.includes("swedish")) return ["SE"];
  if (source.includes("iranian")) return ["IR"];
  if (source.includes("spanish")) return ["ES"];
  if (source.includes("german")) return ["DE"];

  return [];
}

function blendMoodProfiles(previous: Mood | undefined, next: Mood, weight: number): Mood {
  if (!previous) {
    return next;
  }

  const blend = (left: number, right: number) => Math.round((left * (weight - 1) + right) / weight);

  return {
    stress: blend(previous.stress, next.stress),
    happiness: blend(previous.happiness, next.happiness),
    complexity: blend(previous.complexity, next.complexity),
    pace: blend(previous.pace, next.pace)
  };
}

function scoreMovie(movie: SeedFilm, mood: Mood, filters: DiscoveryFilters) {
  const distance =
    Math.abs(movie.moodProfile.stress - mood.stress) * 1.1 +
    Math.abs(movie.moodProfile.happiness - mood.happiness) * 1.05 +
    Math.abs(movie.moodProfile.complexity - mood.complexity) * 1.15 +
    Math.abs(movie.moodProfile.pace - mood.pace) * 1.1;

  const sourceBonus = movie.sourceLists.some((source) => source.includes("Feuille2Cedric")) ? 18 : 0;
  const obscurityBonus = 36 - Math.abs(movie.obscurity - filters.obscurity) * 0.8;

  return 160 - distance + sourceBonus + obscurityBonus;
}

function buildMatchReason(movie: SeedFilm, mood: Mood) {
  const traits = [
    { label: mood.stress > 55 ? "pressure" : "restraint", diff: Math.abs(movie.moodProfile.stress - mood.stress) },
    {
      label: mood.happiness > 55 ? "catharsis" : "darker texture",
      diff: Math.abs(movie.moodProfile.happiness - mood.happiness)
    },
    {
      label: mood.complexity > 55 ? "layered structure" : "clean line",
      diff: Math.abs(movie.moodProfile.complexity - mood.complexity)
    },
    { label: mood.pace > 55 ? "momentum" : "slow-burn rhythm", diff: Math.abs(movie.moodProfile.pace - mood.pace) }
  ]
    .sort((left, right) => left.diff - right.diff)
    .slice(0, 2)
    .map((trait) => trait.label)
    .join(" and ");

  return `Seeded from ${movie.sourceLists[0]} and tuned for ${traits}.`;
}

function buildLetterboxdQuery(filters: DiscoveryFilters, platforms: string[], poolSize: number) {
  const country = filters.country !== "any" ? ` / ${filters.country}` : "";
  const era = filters.era !== "any" ? ` / ${filters.era}` : "";
  const platformsText = platforms.length ? ` / ${platforms.join(", ")}` : "";
  return `Letterboxd-seeded pool (${poolSize} films) / obscurity ${filters.obscurity}${country}${era}${platformsText}`;
}

function matchesCountry(countries: string[], selectedCountry: string) {
  return selectedCountry === "any" ? true : countries.includes(selectedCountry);
}

function matchesEra(year: string, selectedEra: string) {
  if (selectedEra === "any") {
    return true;
  }

  const numericYear = Number(year);
  if (!numericYear) {
    return false;
  }

  if (selectedEra === "pre-1970") {
    return numericYear < 1970;
  }

  if (selectedEra === "2020s") {
    return numericYear >= 2020;
  }

  const decadeStart = Number(selectedEra.slice(0, 4));
  return numericYear >= decadeStart && numericYear < decadeStart + 10;
}

function matchesObscurity(movieObscurity: number, selectedObscurity: number) {
  if (selectedObscurity >= 85) {
    return movieObscurity >= 72;
  }

  if (selectedObscurity >= 68) {
    return movieObscurity >= 56;
  }

  if (selectedObscurity >= 52) {
    return movieObscurity >= 42;
  }

  if (selectedObscurity <= 15) {
    return movieObscurity <= 24;
  }

  if (selectedObscurity <= 30) {
    return movieObscurity <= 38;
  }

  return true;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
