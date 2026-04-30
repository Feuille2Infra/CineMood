export type MoodKey = "stress" | "happiness" | "complexity" | "pace";

export type Mood = Record<MoodKey, number>;

export type Movie = {
  id: string;
  title: string;
  year: string;
  poster: string;
  overview: string;
  matchReason: string;
  provider: string;
  providerLogo?: string;
  watchUrl: string;
  rating: number;
};

type CuratedMovie = Omit<Movie, "provider" | "matchReason"> & {
  providers: string[];
  moodProfile: Mood;
  tags: string[];
  hook: string;
};

export type SearchResponse = {
  query: string;
  movies: Movie[];
};

export const platforms = ["Netflix", "Disney+", "Prime Video", "Max", "Hulu", "Apple TV+"];

export const defaultMood: Mood = {
  stress: 42,
  happiness: 70,
  complexity: 58,
  pace: 66
};

const defaultPlatforms = ["Netflix", "Prime Video", "Max"];

const curatedMovies: CuratedMovie[] = [
  {
    id: "603",
    title: "The Matrix",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    overview: "A hacker discovers reality is far stranger and more dangerous than it appears.",
    hook: "A neon pressure-cooker with a big-idea payoff.",
    providers: ["Max", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/the-matrix",
    rating: 8.2,
    moodProfile: { stress: 78, happiness: 44, complexity: 86, pace: 88 },
    tags: ["cyberpunk", "mind-bending", "action"]
  },
  {
    id: "496243",
    title: "Parasite",
    year: "2019",
    poster: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    overview: "A dark social thriller where one family's plan turns into a volatile collision.",
    hook: "Sharp tension and social bite without losing momentum.",
    providers: ["Hulu", "Netflix"],
    watchUrl: "https://www.justwatch.com/us/movie/parasite-2019",
    rating: 8.5,
    moodProfile: { stress: 74, happiness: 24, complexity: 82, pace: 70 },
    tags: ["thriller", "satire", "twisty"]
  },
  {
    id: "13",
    title: "Forrest Gump",
    year: "1994",
    poster: "https://image.tmdb.org/t/p/w780/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    overview: "A gentle, sweeping life story full of warmth, loss, and unexpected history.",
    hook: "Comforting, open-hearted, and easy to settle into.",
    providers: ["Netflix", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/forrest-gump",
    rating: 8.4,
    moodProfile: { stress: 18, happiness: 84, complexity: 38, pace: 34 },
    tags: ["uplifting", "heartfelt", "classic"]
  },
  {
    id: "550",
    title: "Fight Club",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    overview: "A restless office worker is pulled into an anarchic underground world.",
    hook: "A jagged spiral for high stress and darker energy.",
    providers: ["Prime Video", "Hulu"],
    watchUrl: "https://www.justwatch.com/us/movie/fight-club",
    rating: 8.4,
    moodProfile: { stress: 88, happiness: 16, complexity: 84, pace: 80 },
    tags: ["psychological", "dark", "cult"]
  },
  {
    id: "157336",
    title: "Interstellar",
    year: "2014",
    poster: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    overview: "Explorers travel beyond Earth in search of a future for humanity.",
    hook: "Big emotion and bigger ideas with room to breathe.",
    providers: ["Prime Video", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/interstellar",
    rating: 8.5,
    moodProfile: { stress: 52, happiness: 46, complexity: 92, pace: 58 },
    tags: ["epic", "space", "emotional"]
  },
  {
    id: "76341",
    title: "Mad Max: Fury Road",
    year: "2015",
    poster: "https://image.tmdb.org/t/p/w780/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    overview: "In a brutal wasteland, two rebels fight to outrun a tyrant.",
    hook: "Pure velocity when you want cinema to hit immediately.",
    providers: ["Max", "Netflix"],
    watchUrl: "https://www.justwatch.com/us/movie/mad-max-fury-road",
    rating: 7.9,
    moodProfile: { stress: 90, happiness: 42, complexity: 28, pace: 100 },
    tags: ["action", "adrenaline", "survival"]
  },
  {
    id: "329865",
    title: "Arrival",
    year: "2016",
    poster: "https://image.tmdb.org/t/p/w780/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    overview: "A linguist leads humanity's first contact with mysterious visitors.",
    hook: "Quiet tension with a cerebral, emotional build.",
    providers: ["Netflix", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/arrival-2016",
    rating: 7.6,
    moodProfile: { stress: 40, happiness: 30, complexity: 90, pace: 36 },
    tags: ["thoughtful", "sci-fi", "mystery"]
  },
  {
    id: "244786",
    title: "Whiplash",
    year: "2014",
    poster: "https://image.tmdb.org/t/p/w780/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    overview: "A driven drummer is pushed to his limits by a ruthless mentor.",
    hook: "Relentless pressure with razor-sharp pacing.",
    providers: ["Prime Video", "Netflix"],
    watchUrl: "https://www.justwatch.com/us/movie/whiplash-2014",
    rating: 8.4,
    moodProfile: { stress: 92, happiness: 22, complexity: 56, pace: 86 },
    tags: ["intense", "music", "drama"]
  },
  {
    id: "49047",
    title: "Gravity",
    year: "2013",
    poster: "https://image.tmdb.org/t/p/w780/kZ2nZw8D681aphje8NJi8EfbL1U.jpg",
    overview: "A medical engineer drifts through space after a disaster destroys her mission.",
    hook: "Lean, immediate survival suspense with almost no slack.",
    providers: ["Max", "Hulu"],
    watchUrl: "https://www.justwatch.com/us/movie/gravity",
    rating: 7.2,
    moodProfile: { stress: 86, happiness: 28, complexity: 42, pace: 84 },
    tags: ["survival", "space", "thriller"]
  },
  {
    id: "8587",
    title: "The Lion King",
    year: "1994",
    poster: "https://image.tmdb.org/t/p/w780/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    overview: "A young lion prince must grow into his place in the circle of life.",
    hook: "Big warmth, clear emotion, and a crowd-pleasing lift.",
    providers: ["Disney+"],
    watchUrl: "https://www.justwatch.com/us/movie/the-lion-king-1994",
    rating: 8.3,
    moodProfile: { stress: 26, happiness: 88, complexity: 26, pace: 52 },
    tags: ["uplifting", "family", "musical"]
  },
  {
    id: "862",
    title: "Toy Story",
    year: "1995",
    poster: "https://image.tmdb.org/t/p/w780/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    overview: "A cowboy doll's world changes when a flashy new toy arrives.",
    hook: "Playful and accessible when you want something light on its feet.",
    providers: ["Disney+"],
    watchUrl: "https://www.justwatch.com/us/movie/toy-story",
    rating: 8.0,
    moodProfile: { stress: 12, happiness: 92, complexity: 20, pace: 58 },
    tags: ["uplifting", "family", "easy-watch"]
  },
  {
    id: "637",
    title: "Life Is Beautiful",
    year: "1997",
    poster: "https://image.tmdb.org/t/p/w780/74hLDKjD5aGYOotO6esUVaeISa2.jpg",
    overview: "A father uses humor and imagination to shield his son from wartime horror.",
    hook: "Tender and bittersweet with a strong emotional release.",
    providers: ["Netflix", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/life-is-beautiful",
    rating: 8.4,
    moodProfile: { stress: 38, happiness: 74, complexity: 48, pace: 32 },
    tags: ["heartfelt", "bittersweet", "classic"]
  },
  {
    id: "27205",
    title: "Inception",
    year: "2010",
    poster: "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    overview: "A thief enters dreams to plant an idea inside a target's mind.",
    hook: "A slick blockbuster puzzle for high-complexity moods.",
    providers: ["Netflix", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/inception",
    rating: 8.4,
    moodProfile: { stress: 74, happiness: 36, complexity: 94, pace: 82 },
    tags: ["mind-bending", "heist", "action"]
  },
  {
    id: "106646",
    title: "The Wolf of Wall Street",
    year: "2013",
    poster: "https://image.tmdb.org/t/p/w780/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    overview: "A stockbroker's rise becomes a reckless binge of excess and fraud.",
    hook: "Loud, chaotic energy when subtlety is not the assignment.",
    providers: ["Prime Video", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/the-wolf-of-wall-street",
    rating: 8.0,
    moodProfile: { stress: 68, happiness: 58, complexity: 50, pace: 88 },
    tags: ["chaotic", "dark-comedy", "fast"]
  }
];

export function defaultRecommendations(): SearchResponse {
  return localRecommend(defaultMood, defaultPlatforms, []);
}

export function localRecommend(mood: Mood, selectedPlatforms: string[], skipped: string[]): SearchResponse {
  const normalizedMood = normalizeMood(mood);
  const skippedSet = new Set(skipped);
  const activePlatforms = selectedPlatforms.length ? selectedPlatforms : platforms;

  const ranked = curatedMovies
    .filter((movie) => !skippedSet.has(movie.id))
    .map((movie) => {
      const matchingProviders = movie.providers.filter((provider) => activePlatforms.includes(provider));
      const provider = matchingProviders[0] || movie.providers[0];

      const distance =
        Math.abs(movie.moodProfile.stress - normalizedMood.stress) * 1.15 +
        Math.abs(movie.moodProfile.happiness - normalizedMood.happiness) * 1.05 +
        Math.abs(movie.moodProfile.complexity - normalizedMood.complexity) * 1.1 +
        Math.abs(movie.moodProfile.pace - normalizedMood.pace) * 1.2;

      const tagBonus = getTagBonus(movie.tags, normalizedMood);
      const providerBonus = selectedPlatforms.length ? (matchingProviders.length ? 18 : -26) : 0;
      const score = 140 - distance + tagBonus + providerBonus;

      return {
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          poster: movie.poster,
          overview: movie.overview,
          matchReason: buildReason(movie, normalizedMood),
          provider,
          watchUrl: buildWatchUrl(movie, provider),
          rating: movie.rating
        },
        providers: movie.providers,
        score
      };
    });

  const platformFiltered = selectedPlatforms.length
    ? ranked.filter((entry) => entry.providers.some((provider) => activePlatforms.includes(provider)))
    : ranked;

  const movies = platformFiltered
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
    .map((entry) => entry.movie);

  return {
    query: buildQuery(normalizedMood, selectedPlatforms),
    movies
  };
}

function normalizeMood(mood: Mood): Mood {
  return {
    stress: clamp(mood.stress),
    happiness: clamp(mood.happiness),
    complexity: clamp(mood.complexity),
    pace: clamp(mood.pace)
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function buildQuery(mood: Mood, selectedPlatforms: string[]) {
  const stress = mood.stress > 72 ? "high-tension" : mood.stress > 45 ? "charged" : "calm";
  const happiness = mood.happiness > 70 ? "uplifting" : mood.happiness > 40 ? "bittersweet" : "brooding";
  const complexity = mood.complexity > 72 ? "brainy" : mood.complexity > 45 ? "layered" : "straightforward";
  const pace = mood.pace > 72 ? "propulsive" : mood.pace > 45 ? "steady" : "slow-burn";
  const platformSuffix = selectedPlatforms.length ? ` on ${selectedPlatforms.join(", ")}` : "";

  return `${stress} ${happiness} ${pace} movies with ${complexity} storytelling${platformSuffix}`;
}

function buildReason(movie: CuratedMovie, mood: Mood) {
  const closestTraits = [
    { label: mood.stress > 50 ? "intensity" : "calm", diff: Math.abs(movie.moodProfile.stress - mood.stress) },
    {
      label: mood.happiness > 50 ? "emotional lift" : "darker mood",
      diff: Math.abs(movie.moodProfile.happiness - mood.happiness)
    },
    {
      label: mood.complexity > 50 ? "layered plotting" : "clarity",
      diff: Math.abs(movie.moodProfile.complexity - mood.complexity)
    },
    { label: mood.pace > 50 ? "speed" : "breathing room", diff: Math.abs(movie.moodProfile.pace - mood.pace) }
  ]
    .sort((left, right) => left.diff - right.diff)
    .slice(0, 2)
    .map((trait) => trait.label)
    .join(" and ");

  return `${movie.hook} Best match for ${closestTraits}.`;
}

function getTagBonus(tags: string[], mood: Mood) {
  let bonus = 0;

  if (mood.happiness > 68 && (tags.includes("uplifting") || tags.includes("heartfelt"))) {
    bonus += 12;
  }
  if (mood.happiness < 35 && (tags.includes("dark") || tags.includes("thriller"))) {
    bonus += 10;
  }
  if (mood.complexity > 68 && (tags.includes("mind-bending") || tags.includes("mystery"))) {
    bonus += 12;
  }
  if (mood.pace > 68 && (tags.includes("action") || tags.includes("fast") || tags.includes("adrenaline"))) {
    bonus += 12;
  }
  if (mood.stress < 35 && (tags.includes("family") || tags.includes("easy-watch"))) {
    bonus += 10;
  }

  return bonus;
}

function buildWatchUrl(movie: CuratedMovie, provider: string) {
  const providerSlug = provider.toLowerCase().replaceAll("+", "plus").replaceAll(" ", "-");
  return `${movie.watchUrl}?preferred=${providerSlug}`;
}
