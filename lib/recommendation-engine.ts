export type MoodKey = "stress" | "happiness" | "complexity" | "pace";

export type Mood = Record<MoodKey, number>;

export type DiscoveryFilters = {
  country: string;
  era: string;
  obscurity: number;
};

export type Movie = {
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
  providerLogo?: string;
  watchUrl: string;
  rating: number;
};

type CuratedMovie = Omit<Movie, "provider" | "matchReason" | "availability" | "countries" | "sourceLists"> & {
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

export const countryOptions = [
  { value: "any", label: "Anywhere" },
  { value: "US", label: "United States" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "HK", label: "Hong Kong" },
  { value: "IT", label: "Italy" },
  { value: "SE", label: "Sweden" },
  { value: "IR", label: "Iran" },
  { value: "TW", label: "Taiwan" },
  { value: "ES", label: "Spain" },
  { value: "DE", label: "Germany" },
  { value: "SU", label: "Soviet Union" }
] as const;

export const eraOptions = [
  { value: "any", label: "Any Era" },
  { value: "pre-1970", label: "Pre-1970" },
  { value: "1970s", label: "1970s" },
  { value: "1980s", label: "1980s" },
  { value: "1990s", label: "1990s" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" }
] as const;

export const defaultMood: Mood = {
  stress: 42,
  happiness: 70,
  complexity: 58,
  pace: 66
};

export const defaultFilters: DiscoveryFilters = {
  country: "any",
  era: "any",
  obscurity: 28
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
  },
  {
    id: "843",
    title: "In the Mood for Love",
    year: "2000",
    poster: "https://image.tmdb.org/t/p/w780/iYypPT4bhqXfq1bWmMKLwYhZIvU.jpg",
    overview: "Two neighbors form an intimate bond while suspecting their spouses are having an affair.",
    hook: "A lush, aching slow-burn for nights that want pure atmosphere.",
    providers: ["Prime Video", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/in-the-mood-for-love",
    rating: 8.1,
    moodProfile: { stress: 18, happiness: 26, complexity: 68, pace: 20 },
    tags: ["romance", "slow-burn", "art-house"]
  },
  {
    id: "1398",
    title: "Stalker",
    year: "1979",
    poster: "https://image.tmdb.org/t/p/w780/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
    overview: "Three men travel through a forbidden zone where desires may be fulfilled.",
    hook: "Hypnotic and philosophical when you want something genuinely deep-cut.",
    providers: ["Apple TV+", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/stalker",
    rating: 8.1,
    moodProfile: { stress: 24, happiness: 12, complexity: 98, pace: 8 },
    tags: ["slow-burn", "mind-bending", "art-house"]
  },
  {
    id: "334533",
    title: "Beau Travail",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w780/fpTOj8jLxT0s5QdA0nKXG2WQ9wa.jpg",
    overview: "A foreign legion officer spirals into jealousy and obsession.",
    hook: "Sculptural, sensual, and almost anti-plot in a great way.",
    providers: ["Max", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/beau-travail",
    rating: 7.3,
    moodProfile: { stress: 36, happiness: 10, complexity: 82, pace: 14 },
    tags: ["art-house", "slow-burn", "drama"]
  },
  {
    id: "48450",
    title: "A Brighter Summer Day",
    year: "1991",
    poster: "https://image.tmdb.org/t/p/w780/AxvX1IYh5b7mL48bLJ1O0hJj6YV.jpg",
    overview: "A teenager drifts toward violence amid family tension and youth-gang rivalries in 1960s Taipei.",
    hook: "Expansive, patient, and incredibly rich if you want a rare masterpiece.",
    providers: ["Apple TV+", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/a-brighter-summer-day",
    rating: 8.3,
    moodProfile: { stress: 44, happiness: 16, complexity: 96, pace: 16 },
    tags: ["art-house", "epic", "layered"]
  },
  {
    id: "10376",
    title: "Taste of Cherry",
    year: "1997",
    poster: "https://image.tmdb.org/t/p/w780/pT7dP6K1JrVN6a8GN28AL5soNqd.jpg",
    overview: "A man drives through the outskirts of Tehran searching for someone to perform a final task.",
    hook: "Minimal, contemplative, and quietly devastating.",
    providers: ["Apple TV+", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/taste-of-cherry",
    rating: 7.7,
    moodProfile: { stress: 12, happiness: 6, complexity: 84, pace: 6 },
    tags: ["art-house", "meditative", "slow-burn"]
  },
  {
    id: "26617",
    title: "The Spirit of the Beehive",
    year: "1973",
    poster: "https://image.tmdb.org/t/p/w780/eI8Lw2f0x2mW7l9f4vJ6tR8wsnD.jpg",
    overview: "A young girl in rural Spain becomes haunted by the memory of Frankenstein.",
    hook: "Whisper-quiet and uncanny, for a very specific wavelength.",
    providers: ["Apple TV+", "Max"],
    watchUrl: "https://www.justwatch.com/us/movie/the-spirit-of-the-beehive",
    rating: 7.7,
    moodProfile: { stress: 20, happiness: 14, complexity: 76, pace: 10 },
    tags: ["art-house", "slow-burn", "haunting"]
  },
  {
    id: "11423",
    title: "Memories of Murder",
    year: "2003",
    poster: "https://image.tmdb.org/t/p/w780/8M8dptH1QbQZ3DTH8a7Yd3w0r1W.jpg",
    overview: "Detectives stumble through a serial murder case in a small Korean province.",
    hook: "A grim procedural with strange humor and a masterful undertow.",
    providers: ["Hulu", "Netflix"],
    watchUrl: "https://www.justwatch.com/us/movie/memories-of-murder",
    rating: 8.1,
    moodProfile: { stress: 82, happiness: 10, complexity: 78, pace: 58 },
    tags: ["thriller", "crime", "art-house"]
  },
  {
    id: "14537",
    title: "Harakiri",
    year: "1962",
    poster: "https://image.tmdb.org/t/p/w780/8dC7fA1z1s3wW6xP8bN0kUQH6wH.jpg",
    overview: "A ronin requests ritual suicide at a feudal estate, exposing brutal hypocrisy.",
    hook: "Severe, elegant, and morally razor-sharp.",
    providers: ["Max", "Apple TV+"],
    watchUrl: "https://www.justwatch.com/us/movie/harakiri",
    rating: 8.4,
    moodProfile: { stress: 66, happiness: 8, complexity: 88, pace: 24 },
    tags: ["classic", "period", "art-house"]
  },
  {
    id: "406",
    title: "La Haine",
    year: "1995",
    poster: "https://image.tmdb.org/t/p/w780/8M4zG2f9T2W2WH2L2rJQqJ4v2rV.jpg",
    overview: "Three friends roam Paris after a night of riots in the banlieue.",
    hook: "Charged, restless, and politically raw.",
    providers: ["Netflix", "Prime Video"],
    watchUrl: "https://www.justwatch.com/us/movie/la-haine",
    rating: 8.1,
    moodProfile: { stress: 78, happiness: 12, complexity: 70, pace: 62 },
    tags: ["crime", "drama", "art-house"]
  }
];

const movieCountries: Record<string, string[]> = {
  "603": ["US"],
  "496243": ["KR"],
  "13": ["US"],
  "550": ["US"],
  "157336": ["US"],
  "76341": ["US", "AU"],
  "329865": ["US"],
  "244786": ["US"],
  "49047": ["US", "GB"],
  "8587": ["US"],
  "862": ["US"],
  "637": ["IT"],
  "27205": ["US", "GB"],
  "106646": ["US"],
  "49026": ["US", "GB"],
  "1124": ["US", "GB"],
  "120": ["US", "NZ"],
  "313369": ["US"],
  "335984": ["US", "GB", "CA"],
  "11324": ["US"],
  "807": ["US"],
  "12": ["US"],
  "1578": ["US"],
  "640": ["US"],
  "510": ["US"],
  "8078": ["US", "GB"],
  "37165": ["US"],
  "843": ["HK"],
  "1398": ["SU"],
  "334533": ["FR"],
  "48450": ["TW"],
  "10376": ["IR"],
  "26617": ["ES"],
  "11423": ["KR"],
  "14537": ["JP"],
  "406": ["FR"]
};

const movieObscurity: Record<string, number> = {
  "603": 18,
  "496243": 26,
  "13": 16,
  "550": 22,
  "157336": 24,
  "76341": 24,
  "329865": 30,
  "244786": 28,
  "49047": 32,
  "8587": 16,
  "862": 14,
  "637": 42,
  "27205": 18,
  "106646": 20,
  "49026": 14,
  "1124": 34,
  "120": 22,
  "313369": 30,
  "335984": 38,
  "11324": 30,
  "807": 24,
  "12": 12,
  "1578": 54,
  "640": 24,
  "510": 58,
  "8078": 46,
  "37165": 34,
  "843": 72,
  "1398": 94,
  "334533": 90,
  "48450": 96,
  "10376": 92,
  "26617": 93,
  "11423": 62,
  "14537": 84,
  "406": 68
};

const movieSourceLists: Record<string, string[]> = {
  "603": ["Letterboxd Top 500", "Top 250 Science Fiction"],
  "496243": ["Letterboxd Top 500", "Top 100 South Korean Films"],
  "13": ["Feuille2Cedric Top 100", "Letterboxd Top 500"],
  "550": ["Feuille2Cedric Cigarets", "Letterboxd Most Fans"],
  "157336": ["Feuille2Cedric Top 100", "Top 250 Science Fiction"],
  "76341": ["Letterboxd Most Fans"],
  "329865": ["Top 250 Science Fiction", "Feuille2Cedric Top 100"],
  "244786": ["Letterboxd Top 500"],
  "49047": ["Top 250 Science Fiction"],
  "8587": ["Letterboxd Top 500"],
  "862": ["Letterboxd Top 500"],
  "637": ["Top 100 Italian Films"],
  "27205": ["Feuille2Cedric Top 100", "Top 250 Science Fiction"],
  "106646": ["Feuille2Cedric Cigarets", "Letterboxd Most Fans"],
  "49026": ["Feuille2Cedric Top 100", "Letterboxd Most Fans"],
  "1124": ["Feuille2Cedric Top 100"],
  "120": ["Letterboxd Top 500"],
  "313369": ["Feuille2Cedric Top 100"],
  "335984": ["Top 250 Science Fiction", "Top 100 Underseen Films"],
  "11324": ["Feuille2Cedric Top 100"],
  "807": ["Feuille2Cedric Top 100"],
  "12": ["Feuille2Cedric 2025"],
  "1578": ["Top 100 Underseen Films"],
  "640": ["Feuille2Cedric Top 100"],
  "510": ["Letterboxd Top 500"],
  "8078": ["Top 50 Underseen Horror Films"],
  "37165": ["Feuille2Cedric Top 100"],
  "843": ["Feuille2Cedric Cigarets", "Top 100 Underseen Films"],
  "1398": ["Top 100 Underseen Films"],
  "334533": ["Top 100 Underseen Films", "Feuille2Cedric Cigarets"],
  "48450": ["Top 100 Underseen Films", "Top 100 Taiwanese Films"],
  "10376": ["Top 100 Underseen Films"],
  "26617": ["Top 100 Underseen Films"],
  "11423": ["Top 100 South Korean Films", "Top 100 Underseen Films"],
  "14537": ["Letterboxd Top 500", "Top 100 Japanese Films"],
  "406": ["Feuille2Cedric Cigarets", "Top 100 Underseen Films"]
};

export function defaultRecommendations(): SearchResponse {
  return localRecommend(defaultMood, defaultPlatforms, [], defaultFilters);
}

export function localRecommend(
  mood: Mood,
  selectedPlatforms: string[],
  skipped: string[],
  filters: DiscoveryFilters = defaultFilters
): SearchResponse {
  const normalizedMood = normalizeMood(mood);
  const skippedSet = new Set(skipped);
  const activePlatforms = selectedPlatforms.length ? selectedPlatforms : platforms;

  const ranked = curatedMovies
    .filter((movie) => !skippedSet.has(movie.id))
    .filter((movie) => matchesCountry(getMovieCountries(movie.id), filters.country))
    .filter((movie) => matchesEra(movie.year, filters.era))
    .map((movie) => {
      const matchingProviders = movie.providers.filter((provider) => activePlatforms.includes(provider));
      const provider = matchingProviders[0] || movie.providers[0];
      const obscurity = getMovieObscurity(movie.id);

      const distance =
        Math.abs(movie.moodProfile.stress - normalizedMood.stress) * 1.15 +
        Math.abs(movie.moodProfile.happiness - normalizedMood.happiness) * 1.05 +
        Math.abs(movie.moodProfile.complexity - normalizedMood.complexity) * 1.1 +
        Math.abs(movie.moodProfile.pace - normalizedMood.pace) * 1.2;

      const tagBonus = getTagBonus(movie.tags, normalizedMood);
      const obscurityBonus = 28 - Math.abs(obscurity - filters.obscurity) * 0.68;
      const sourceBonus = getSourceBonus(movie.id, filters);
      const providerBonus = selectedPlatforms.length ? (matchingProviders.length ? 18 : -26) : 0;
      const score = 140 - distance + tagBonus + providerBonus + obscurityBonus + sourceBonus;

      return {
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          countries: getMovieCountries(movie.id),
          sourceLists: getMovieSourceLists(movie.id),
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
    query: buildQuery(normalizedMood, selectedPlatforms, filters),
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

function buildQuery(mood: Mood, selectedPlatforms: string[], filters: DiscoveryFilters) {
  const stress = mood.stress > 72 ? "high-tension" : mood.stress > 45 ? "charged" : "calm";
  const happiness = mood.happiness > 70 ? "uplifting" : mood.happiness > 40 ? "bittersweet" : "brooding";
  const complexity = mood.complexity > 72 ? "brainy" : mood.complexity > 45 ? "layered" : "straightforward";
  const pace = mood.pace > 72 ? "propulsive" : mood.pace > 45 ? "steady" : "slow-burn";
  const platformSuffix = selectedPlatforms.length ? ` on ${selectedPlatforms.join(", ")}` : "";
  const countrySuffix = filters.country !== "any" ? ` from ${getCountryLabel(filters.country)}` : "";
  const eraSuffix = filters.era !== "any" ? ` in ${getEraLabel(filters.era)}` : "";
  const obscuritySuffix =
    filters.obscurity > 72 ? " with truly obscure deep cuts" : filters.obscurity > 48 ? " with off-path discoveries" : "";
  const sourceSuffix =
    filters.obscurity > 60
      ? " seeded from underseen Letterboxd lists and Feuille2Cedric picks"
      : " seeded from Letterboxd canon and Feuille2Cedric picks";

  return `${stress} ${happiness} ${pace} movies with ${complexity} storytelling${countrySuffix}${eraSuffix}${platformSuffix}${obscuritySuffix}${sourceSuffix}`;
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

function getMovieCountries(movieId: string) {
  return movieCountries[movieId] || ["US"];
}

function getMovieObscurity(movieId: string) {
  return movieObscurity[movieId] ?? 30;
}

function getMovieSourceLists(movieId: string) {
  return movieSourceLists[movieId] || ["Letterboxd Top 500"];
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

function getCountryLabel(code: string) {
  return countryOptions.find((option) => option.value === code)?.label || code;
}

function getEraLabel(value: string) {
  return eraOptions.find((option) => option.value === value)?.label.toLowerCase() || value;
}

function getSourceBonus(movieId: string, filters: DiscoveryFilters) {
  const sources = getMovieSourceLists(movieId);
  let bonus = 0;

  if (sources.some((source) => source.includes("Feuille2Cedric"))) {
    bonus += 18;
  }
  if (filters.obscurity > 60 && sources.some((source) => source.includes("Underseen"))) {
    bonus += 16;
  }
  if (filters.country !== "any" && sources.some((source) => source.includes("Top 100") || source.includes("Top 50"))) {
    bonus += 10;
  }
  if (filters.obscurity < 36 && sources.some((source) => source.includes("Letterboxd Top 500") || source.includes("Most Fans"))) {
    bonus += 8;
  }

  return bonus;
}
