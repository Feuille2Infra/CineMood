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
  availability: string[];
  providerLogo?: string;
  watchUrl: string;
  rating: number;
};

type CuratedMovie = Omit<Movie, "provider" | "matchReason" | "availability"> & {
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
  },
  {
    id: "49026",
    title: "The Dark Knight",
    year: "2008",
    poster: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    overview: "Batman faces a criminal mastermind who turns Gotham into a test of moral collapse.",
    hook: "A prestige blockbuster with pressure, scale, and a sharp edge.",
    providers: ["Max", "Netflix"],
    watchUrl: "https://www.justwatch.com/us/movie/the-dark-knight",
    rating: 8.5,
    moodProfile: { stress: 82, happiness: 26, complexity: 72, pace: 84 },
    tags: ["action", "dark", "epic"]
  },
  {
    id: "1124",
    title: "The Prestige",
    year: "2006",
    poster: "https://image.tmdb.org/t/p/w780/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg",
    overview: "Two rival magicians push obsession and sacrifice to the edge.",
    hook: "A beautifully wound puzzle for high-complexity nights.",
    providers: ["Prime Video", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/the-prestige",
    rating: 8.2,
    moodProfile: { stress: 58, happiness: 24, complexity: 96, pace: 54 },
    tags: ["mind-bending", "mystery", "period"]
  },
  {
    id: "120",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    poster: "https://image.tmdb.org/t/p/w780/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    overview: "A quiet hobbit begins a journey that will reshape Middle-earth.",
    hook: "Epic comfort cinema with lift, scale, and breathing room.",
    providers: ["Max", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/the-lord-of-the-rings-the-fellowship-of-the-ring",
    rating: 8.4,
    moodProfile: { stress: 36, happiness: 78, complexity: 62, pace: 44 },
    tags: ["epic", "fantasy", "uplifting"]
  },
  {
    id: "313369",
    title: "La La Land",
    year: "2016",
    poster: "https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    overview: "An actress and a jazz musician fall in love while chasing fragile dreams in Los Angeles.",
    hook: "Elegant, bittersweet, and emotionally luminous.",
    providers: ["Netflix", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/la-la-land",
    rating: 7.9,
    moodProfile: { stress: 24, happiness: 72, complexity: 38, pace: 48 },
    tags: ["bittersweet", "musical", "romance"]
  },
  {
    id: "335984",
    title: "Blade Runner 2049",
    year: "2017",
    poster: "https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    overview: "A blade runner uncovers a secret that threatens the fragile order of the future.",
    hook: "Immersive, cerebral, and slow-burning in the best way.",
    providers: ["Netflix", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/blade-runner-2049",
    rating: 8.0,
    moodProfile: { stress: 42, happiness: 20, complexity: 92, pace: 32 },
    tags: ["sci-fi", "slow-burn", "mind-bending"]
  },
  {
    id: "11324",
    title: "Shutter Island",
    year: "2010",
    poster: "https://image.tmdb.org/t/p/w780/52d7PyzNQxzxYF6xVJp4H7M9KzH.jpg",
    overview: "A U.S. Marshal investigates a vanished patient on an isolated island asylum.",
    hook: "Stormy paranoia with a dense psychological undertow.",
    providers: ["Netflix", "Hulu"],
    watchUrl: "https://www.justwatch.com/us/movie/shutter-island",
    rating: 8.2,
    moodProfile: { stress: 84, happiness: 12, complexity: 88, pace: 64 },
    tags: ["thriller", "psychological", "mind-bending"]
  },
  {
    id: "807",
    title: "Se7en",
    year: "1995",
    poster: "https://image.tmdb.org/t/p/w780/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    overview: "Two detectives hunt a serial killer whose crimes are shaped by the seven deadly sins.",
    hook: "Relentless dread for the darkest mood settings.",
    providers: ["Netflix", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/se7en",
    rating: 8.4,
    moodProfile: { stress: 94, happiness: 8, complexity: 70, pace: 74 },
    tags: ["thriller", "dark", "crime"]
  },
  {
    id: "12",
    title: "Finding Nemo",
    year: "2003",
    poster: "https://image.tmdb.org/t/p/w780/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
    overview: "A clownfish crosses the ocean to rescue his son.",
    hook: "A warm, brightly paced reset when you want zero emotional armor.",
    providers: ["Disney+"],
    watchUrl: "https://www.justwatch.com/us/movie/finding-nemo",
    rating: 7.8,
    moodProfile: { stress: 14, happiness: 90, complexity: 18, pace: 56 },
    tags: ["family", "uplifting", "easy-watch"]
  },
  {
    id: "1578",
    title: "Raging Bull",
    year: "1980",
    poster: "https://image.tmdb.org/t/p/w780/1MkB1TopiN3QYyQn8v7yQb5N4nu.jpg",
    overview: "A ferocious boxer self-destructs inside and outside the ring.",
    hook: "Heavy, bruising character cinema with real gravity.",
    providers: ["Prime Video", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/raging-bull",
    rating: 8.1,
    moodProfile: { stress: 70, happiness: 10, complexity: 58, pace: 46 },
    tags: ["classic", "dark", "drama"]
  },
  {
    id: "640",
    title: "Catch Me If You Can",
    year: "2002",
    poster: "https://image.tmdb.org/t/p/w780/sj4pwh8O1eXSRM8dBYxpeqDCLW0.jpg",
    overview: "A gifted con artist stays one step ahead of the FBI while reinventing himself.",
    hook: "Effortless momentum with a bright, clever sheen.",
    providers: ["Netflix", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/catch-me-if-you-can",
    rating: 8.1,
    moodProfile: { stress: 34, happiness: 68, complexity: 54, pace: 74 },
    tags: ["fast", "crime", "uplifting"]
  },
  {
    id: "510",
    title: "One Flew Over the Cuckoo's Nest",
    year: "1975",
    poster: "https://image.tmdb.org/t/p/w780/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg",
    overview: "A rebellious patient disrupts a rigid psychiatric ward.",
    hook: "Sharp, humane, and emotionally layered without being cold.",
    providers: ["Prime Video", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/one-flew-over-the-cuckoos-nest",
    rating: 8.4,
    moodProfile: { stress: 44, happiness: 34, complexity: 66, pace: 40 },
    tags: ["classic", "layered", "drama"]
  },
  {
    id: "8078",
    title: "Alien",
    year: "1979",
    poster: "https://image.tmdb.org/t/p/w780/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    overview: "A commercial spaceship crew is hunted by a lethal organism.",
    hook: "Pure isolation horror with slow-burn pressure.",
    providers: ["Hulu", "Disney+"],
    watchUrl: "https://www.justwatch.com/us/movie/alien",
    rating: 8.2,
    moodProfile: { stress: 92, happiness: 10, complexity: 56, pace: 40 },
    tags: ["horror", "slow-burn", "sci-fi"]
  },
  {
    id: "37165",
    title: "The Truman Show",
    year: "1998",
    poster: "https://image.tmdb.org/t/p/w780/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
    overview: "A man slowly discovers that his entire life is a global television fabrication.",
    hook: "Bright on the surface, quietly existential underneath.",
    providers: ["Netflix", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/the-truman-show",
    rating: 8.1,
    moodProfile: { stress: 28, happiness: 62, complexity: 74, pace: 42 },
    tags: ["mind-bending", "uplifting", "satire"]
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
          availability: matchingProviders.length ? matchingProviders : movie.providers,
          watchUrl: buildWatchUrl(movie, provider),
          rating: movie.rating
        },
        tags: movie.tags,
        year: movie.year,
        providers: movie.providers,
        score
      };
    });

  const platformFiltered = selectedPlatforms.length
    ? ranked.filter((entry) => entry.providers.some((provider) => activePlatforms.includes(provider)))
    : ranked;

  const movies = selectDiverseEntries(platformFiltered, 10)
    .map((entry) => entry.movie);

  return {
    query: buildQuery(normalizedMood, selectedPlatforms),
    movies
  };
}

type RankedEntry = {
  movie: Movie;
  providers: string[];
  score: number;
  tags: string[];
  year: string;
};

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

function selectDiverseEntries(entries: RankedEntry[], limit: number) {
  const pool = [...entries].sort((left, right) => right.score - left.score);
  const selected: RankedEntry[] = [];

  while (pool.length && selected.length < limit) {
    let bestIndex = 0;
    let bestValue = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < pool.length; index += 1) {
      const entry = pool[index];
      const adjustedScore = entry.score - diversityPenalty(entry, selected);
      if (adjustedScore > bestValue) {
        bestValue = adjustedScore;
        bestIndex = index;
      }
    }

    selected.push(pool.splice(bestIndex, 1)[0]);
  }

  return selected;
}

function diversityPenalty(candidate: RankedEntry, selected: RankedEntry[]) {
  if (!selected.length) {
    return 0;
  }

  let penalty = 0;
  const candidateDecade = `${candidate.year.slice(0, 3)}0`;

  for (const entry of selected) {
    const sharedTags = candidate.tags.filter((tag) => entry.tags.includes(tag)).length;
    const sharedProviders = candidate.providers.filter((provider) => entry.providers.includes(provider)).length;
    const sameDecade = `${entry.year.slice(0, 3)}0` === candidateDecade;

    penalty += sharedTags * 7;
    penalty += sharedProviders > 1 ? 2 : 0;
    penalty += sameDecade ? 2 : 0;
  }

  return penalty;
}

function buildWatchUrl(movie: CuratedMovie, provider: string) {
  const providerSlug = provider.toLowerCase().replaceAll("+", "plus").replaceAll(" ", "-");
  return `${movie.watchUrl}?preferred=${providerSlug}`;
}
