"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform
} from "framer-motion";
import { Clapperboard, Loader2, Play, Search, Shuffle, Sparkles, ThumbsDown } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import {
  countryOptions,
  defaultFilters,
  defaultMood,
  defaultRecommendations,
  eraOptions,
  localRecommend,
  platforms,
  type DiscoveryFilters,
  type MoodKey,
  type Movie,
  type SearchResponse
} from "@/lib/recommendation-engine";

const sliders: Array<{ key: MoodKey; label: string; color: string; low: string; high: string }> = [
  { key: "stress", label: "Adrenaline", color: "#E50914", low: "Calm", high: "Intense" },
  { key: "happiness", label: "Tears", color: "#F5B942", low: "Heartwarming", high: "Tragedy" },
  { key: "complexity", label: "Plot Complexity", color: "#8B5CF6", low: "Simple", high: "Mind-blowing" },
  { key: "pace", label: "Pace", color: "#00D1FF", low: "Slow-burn", high: "Fast-paced" }
];

const useStaticRecommendations = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const initialRecommendations = defaultRecommendations();

export default function Home() {
  const [mood, setMood] = useState<Record<MoodKey, number>>(defaultMood);
  const [filters, setFilters] = useState<DiscoveryFilters>(defaultFilters);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Netflix", "Prime Video", "Max"]);
  const [movies, setMovies] = useState<Movie[]>(initialRecommendations.movies);
  const [query, setQuery] = useState(initialRecommendations.query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);

  const activeMovie = movies[0];
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 180], [-12, 12]);
  const mobileOpacity = useTransform(dragX, [-180, 0, 180], [0.42, 1, 0.42]);

  const intensity = useMemo(
    () => Math.round((mood.stress + mood.pace + mood.complexity + (100 - mood.happiness)) / 4),
    [mood]
  );
  const currentMoodLabel = useMemo(() => describeMood(mood), [mood]);
  const noMatch = error === "No matches for this specific mood.";
  const adrenalineGlow = 0.28 + (mood.stress + mood.pace) / 320;
  const complexityGlow = 0.18 + mood.complexity / 360;
  const tearGlow = 0.12 + mood.happiness / 420;

  async function runSearch(
    nextMood: Record<MoodKey, number>,
    nextPlatforms: string[],
    nextSkipped: string[],
    nextFilters: DiscoveryFilters
  ) {
    setLoading(true);
    setError("");

    try {
      if (useStaticRecommendations) {
        const data = localRecommend(nextMood, nextPlatforms, nextSkipped, nextFilters);
        applyResults(data);
        return;
      }

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: nextMood, platforms: nextPlatforms, skipped: nextSkipped, filters: nextFilters })
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as SearchResponse;
      applyResults(data);
    } catch {
      const data = localRecommend(nextMood, nextPlatforms, nextSkipped, nextFilters);
      applyResults(data, !data.movies.length ? "No matches for this specific mood." : "Live APIs unavailable, using curated mood matching.");
    } finally {
      setLoading(false);
    }
  }

  function applyResults(data: SearchResponse, fallbackError = "") {
    setMovies(data.movies);
    setQuery(data.query);

    if (!data.movies.length) {
      setError("No matches for this specific mood.");
      return;
    }

    setError(fallbackError);
  }

  function findMovies() {
    runSearch(mood, selectedPlatforms, skipped, filters);
  }

  function surpriseMe() {
    const surpriseMood = {
      stress: randomValue(),
      happiness: randomValue(),
      complexity: randomValue(),
      pace: randomValue()
    };

    setMood(surpriseMood);
    setFilters(defaultFilters);
    setSelectedPlatforms([]);
    setSkipped([]);
    dragX.set(0);
    runSearch(surpriseMood, [], [], defaultFilters);
  }

  function randomValue() {
    return Math.floor(Math.random() * 101);
  }

  function togglePlatform(platform: string) {
    const nextPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((item) => item !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(nextPlatforms);
    setSkipped([]);
    dragX.set(0);
    runSearch(mood, nextPlatforms, [], filters);
  }

  function updateCountry(country: string) {
    const nextFilters = { ...filters, country };
    setFilters(nextFilters);
    setSkipped([]);
    dragX.set(0);
    runSearch(mood, selectedPlatforms, [], nextFilters);
  }

  function updateEra(era: string) {
    const nextFilters = { ...filters, era };
    setFilters(nextFilters);
    setSkipped([]);
    dragX.set(0);
    runSearch(mood, selectedPlatforms, [], nextFilters);
  }

  function skipMovie(movie: Movie) {
    dragX.set(0);
    setSkipped((current) => [...current, movie.id]);
    setMovies((current) => current.filter((item) => item.id !== movie.id));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cinema-black text-slate-50">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: adrenalineGlow }}
      >
        <div className="absolute left-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-cinema-red/25 blur-3xl" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: complexityGlow }}
      >
        <div className="absolute right-[-7rem] top-[6rem] h-[24rem] w-[24rem] rounded-full bg-cinema-blue/18 blur-3xl" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: tearGlow }}
      >
        <div className="absolute left-1/2 top-[-10rem] h-[26rem] w-[30rem] -translate-x-1/2 rounded-full bg-violet-600/18 blur-3xl" />
      </motion.div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-glass backdrop-blur-xl">
              <Clapperboard className="h-6 w-6 text-cinema-red" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cinema-blue/80">Cinema Dark</p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">CineMood</h1>
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
            Mood intensity <span className="font-mono text-cinema-blue">{intensity}%</span>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-10 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              animate={{ boxShadow: `0 0 ${24 + intensity}px rgba(229, 9, 20, ${0.08 + intensity / 500})` }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-cinema-blue" />
              Emotional movie matching
            </motion.div>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find my Match
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Dial in the exact emotional texture you want tonight. CineMood maps your sliders to a premium film strip,
              then filters it to where you can actually watch.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-glass backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%),linear-gradient(135deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))]" />
            <div className="relative">
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Mood interface</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">Set the emotional frame</h3>
                    </div>
                    <div className="rounded-2xl border border-cinema-blue/20 bg-cinema-blue/10 px-4 py-3 text-left">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-cinema-blue">Current mood</p>
                      <p className="mt-2 text-sm text-slate-100">{currentMoodLabel}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {sliders.map((slider) => (
                      <motion.div
                        key={slider.key}
                        animate={{
                          boxShadow: `0 10px 30px color-mix(in srgb, ${slider.color} 10%, transparent)`
                        }}
                        className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{slider.label}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {slider.low} to {slider.high}
                            </p>
                          </div>
                          <div
                            className="rounded-full px-3 py-1 font-mono text-sm"
                            style={{ color: slider.color, backgroundColor: `${slider.color}18` }}
                          >
                            {mood[slider.key]}
                          </div>
                        </div>

                        <div className="mt-6">
                          <input
                            aria-label={slider.label}
                            className="cinema-slider"
                            max={100}
                            min={0}
                            style={{ "--slider-color": slider.color } as CSSProperties}
                            type="range"
                            value={mood[slider.key]}
                            onChange={(event) =>
                              setMood((current) => ({ ...current, [slider.key]: Number(event.target.value) }))
                            }
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-500">
                          <span>{slider.low}</span>
                          <span>{slider.high}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Platforms</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Watch on my platforms</h3>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {platforms.map((platform) => {
                        const active = selectedPlatforms.includes(platform);
                        return (
                          <button
                            key={platform}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              active
                                ? "border-cinema-red/40 bg-cinema-red/20 text-white shadow-redglow"
                                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                            }`}
                            onClick={() => togglePlatform(platform)}
                          >
                            {platform}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-slate-500">Country</span>
                        <select
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cinema-blue/40"
                          value={filters.country}
                          onChange={(event) => updateCountry(event.target.value)}
                        >
                          {countryOptions.map((option) => (
                            <option key={option.value} className="bg-zinc-950" value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-slate-500">Era</span>
                        <select
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cinema-blue/40"
                          value={filters.era}
                          onChange={(event) => updateEra(event.target.value)}
                        >
                          {eraOptions.map((option) => (
                            <option key={option.value} className="bg-zinc-950" value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Deep Cuts</p>
                          <p className="mt-1 text-xs text-slate-400">Push the engine toward much rarer picks.</p>
                        </div>
                        <div className="rounded-full bg-cinema-blue/10 px-3 py-1 font-mono text-sm text-cinema-blue">
                          {filters.obscurity}
                        </div>
                      </div>
                      <div className="mt-5">
                        <input
                          aria-label="Deep cuts level"
                          className="cinema-slider"
                          max={100}
                          min={0}
                          style={{ "--slider-color": "#00D1FF" } as CSSProperties}
                          type="range"
                          value={filters.obscurity}
                          onChange={(event) =>
                            setFilters((current) => ({ ...current, obscurity: Number(event.target.value) }))
                          }
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        <span>Accessible</span>
                        <span>Obscure</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Discovery prompt</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{query}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      animate={{
                        boxShadow: `0 0 ${28 + intensity}px rgba(229, 9, 20, ${0.14 + intensity / 420})`
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cinema-red px-5 py-4 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={loading}
                      onClick={findMovies}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                      Find my Match
                    </motion.button>
                    <button
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
                      onClick={surpriseMe}
                    >
                      <Shuffle className="h-4 w-4 text-cinema-blue" />
                      Surprise Me
                    </button>
                  </div>

                  {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Results</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Your film strip</h3>
              </div>
              <p className="font-mono text-xs text-slate-400">{movies.length.toString().padStart(2, "0")} matches</p>
            </div>

            <div className="hidden lg:block">
              {movies.length ? (
                <FilmStrip>
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </FilmStrip>
              ) : (
                <EmptyState
                  description="Your platform filter and emotional mix are unusually specific. Reset the night with a wildcard pick."
                  title="No matches for this specific mood"
                  onSurprise={surpriseMe}
                />
              )}
            </div>

            <div className="lg:hidden">
              <AnimatePresence mode="popLayout">
                {activeMovie ? (
                  <motion.div
                    key={activeMovie.id}
                    className="mx-auto w-full max-w-sm touch-none"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.x) > 110) {
                        skipMovie(activeMovie);
                      }
                    }}
                    style={{ x: dragX, rotate, opacity: mobileOpacity }}
                    exit={{ x: -240, opacity: 0, scale: 0.94 }}
                  >
                    <MovieCard movie={activeMovie} mobile onSkip={() => skipMovie(activeMovie)} />
                  </motion.div>
                ) : (
                  <EmptyState
                    description={
                      noMatch
                        ? "Your platform filter and emotional mix are unusually specific. Reset the night with a wildcard pick."
                        : "You have swiped through this strip. Spin up another emotional profile and let CineMood recut the lineup."
                    }
                    title={noMatch ? "No matches for this specific mood" : "You reached the end of this strip"}
                    onSurprise={surpriseMe}
                  />
                )}
              </AnimatePresence>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function FilmStrip({ children }: { children: ReactNode }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, pointerId: -1, startX: 0, scrollLeft: 0 });

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    if (!strip) {
      return;
    }

    dragState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: strip.scrollLeft
    };

    strip.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    if (!strip || !dragState.current.active) {
      return;
    }

    const distance = event.clientX - dragState.current.startX;
    strip.scrollLeft = dragState.current.scrollLeft - distance;
  }

  function endDrag(event?: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    if (!strip || !dragState.current.active) {
      return;
    }

    if (event && strip.hasPointerCapture(dragState.current.pointerId)) {
      strip.releasePointerCapture(dragState.current.pointerId);
    }

    dragState.current.active = false;
  }

  return (
    <div className="space-y-3">
      <p className="px-2 text-[11px] uppercase tracking-[0.26em] text-slate-500">
        Grab and drag to explore the full strip
      </p>
      <div
        ref={stripRef}
        className="poster-mask no-scrollbar flex cursor-grab gap-5 overflow-x-auto px-2 py-6 active:cursor-grabbing select-none"
        onPointerCancel={endDrag}
        onPointerDown={handlePointerDown}
        onPointerLeave={endDrag}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
      >
        {children}
      </div>
    </div>
  );
}

function MovieCard({ movie, mobile = false, onSkip }: { movie: Movie; mobile?: boolean; onSkip?: () => void }) {
  const countryLabel = movie.countries.length ? movie.countries.join(" / ") : "Global";

  return (
    <motion.article
      className={`group relative shrink-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 shadow-2xl ${
        mobile ? "w-full" : "w-[19rem]"
      }`}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ scale: mobile ? 1 : 1.05, y: mobile ? 0 : -10 }}
    >
      <div className="relative aspect-[0.74] w-full">
        <PosterArt movie={movie} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/82 to-black/20 p-5 transition duration-300 ${
            mobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.26em] text-cinema-blue">Mood Summary</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{movie.matchReason}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
            {countryLabel} / {movie.year}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.availability.map((item) => (
              <PlatformBadge key={item} name={item} />
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <a
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cinema-red px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
              href={movie.watchUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Play className="h-4 w-4 fill-white" />
              Watch Now
            </a>
            {mobile && onSkip ? (
              <button
                aria-label="Skip movie"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10"
                onClick={onSkip}
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        <div className={`absolute inset-x-0 bottom-0 p-5 ${mobile ? "opacity-0" : "group-hover:opacity-0"} transition`}>
          <div className="max-w-[80%]">
            <h4 className="text-2xl font-black text-white">{movie.title}</h4>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-slate-300">
              {countryLabel} / {movie.year} / {movie.rating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PlatformBadge({ name }: { name: string }) {
  const badgeStyles: Record<string, string> = {
    Netflix: "bg-red-500/20 text-red-100 border-red-400/20",
    "Prime Video": "bg-sky-500/20 text-sky-100 border-sky-400/20",
    "Disney+": "bg-indigo-500/20 text-indigo-100 border-indigo-400/20",
    Max: "bg-violet-500/20 text-violet-100 border-violet-400/20",
    Hulu: "bg-emerald-500/20 text-emerald-100 border-emerald-400/20",
    "Apple TV+": "bg-slate-400/20 text-slate-100 border-slate-300/20",
    JustWatch: "bg-white/10 text-slate-100 border-white/10"
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
        badgeStyles[name] || "bg-white/10 text-slate-100 border-white/10"
      }`}
    >
      {name}
    </span>
  );
}

function PosterArt({ movie }: { movie: Movie }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,209,255,0.24),_transparent_42%),linear-gradient(160deg,_rgba(229,9,20,0.26),_rgba(5,5,5,0.96)_70%)]">
        <div className="absolute inset-x-5 top-5 text-[11px] uppercase tracking-[0.28em] text-slate-300">Curated pick</div>
        <div className="absolute inset-x-5 bottom-24">
          <p className="text-3xl font-black leading-tight text-white">{movie.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{movie.overview}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      alt={`${movie.title} poster`}
      className="object-cover"
      fill
      sizes="(max-width: 1024px) 92vw, 304px"
      src={movie.poster}
      onError={() => setFailed(true)}
    />
  );
}

function EmptyState({
  description,
  title,
  onSurprise
}: {
  description: string;
  title: string;
  onSurprise: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-glass backdrop-blur-2xl">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">No exact match</p>
      <h4 className="mt-3 text-2xl font-bold text-white">{title}</h4>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
      <button
        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.1]"
        onClick={onSurprise}
      >
        <Shuffle className="h-4 w-4 text-cinema-blue" />
        Surprise Me
      </button>
    </div>
  );
}

function describeMood(mood: Record<MoodKey, number>) {
  const pace = mood.pace > 66 ? "fast and kinetic" : mood.pace < 34 ? "slow and atmospheric" : "steady";
  const complexity =
    mood.complexity > 66 ? "with mind-bending turns" : mood.complexity < 34 ? "with a clean emotional line" : "with layered storytelling";
  const tone =
    mood.happiness < 34 ? "leaning tragic" : mood.happiness > 66 ? "leaning cathartic" : "leaning bittersweet";
  const pressure = mood.stress > 66 ? "high pressure" : mood.stress < 34 ? "softly paced" : "gently tense";

  return `${pace}, ${complexity}, ${tone}, ${pressure}.`;
}
