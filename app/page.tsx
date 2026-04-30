"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Clapperboard, Loader2, Play, Search, Sparkles, ThumbsDown } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import {
  defaultMood,
  defaultRecommendations,
  localRecommend,
  platforms,
  type MoodKey,
  type Movie,
  type SearchResponse
} from "@/lib/recommendation-engine";

const sliders: Array<{ key: MoodKey; label: string; color: string; low: string; high: string }> = [
  { key: "stress", label: "Stress", color: "#E50914", low: "Calm", high: "Intense" },
  { key: "happiness", label: "Happiness", color: "#F9D423", low: "Heavy", high: "Bright" },
  { key: "complexity", label: "Plot", color: "#9B5CFF", low: "Simple", high: "Layered" },
  { key: "pace", label: "Pace", color: "#00D1FF", low: "Slow", high: "Fast" }
];

const useStaticRecommendations = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const initialRecommendations = defaultRecommendations();

export default function Home() {
  const [mood, setMood] = useState<Record<MoodKey, number>>(defaultMood);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Netflix", "Prime Video", "Max"]);
  const [movies, setMovies] = useState<Movie[]>(initialRecommendations.movies);
  const [query, setQuery] = useState(initialRecommendations.query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);

  const activeMovie = movies[0];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-14, 14]);
  const opacity = useTransform(x, [-180, 0, 180], [0.48, 1, 0.48]);

  const intensity = useMemo(() => Math.round((mood.stress + mood.pace + mood.complexity) / 3), [mood]);

  async function findMovies() {
    setLoading(true);
    setError("");
    try {
      if (useStaticRecommendations) {
        const data = localRecommend(mood, selectedPlatforms, skipped);
        setMovies(data.movies);
        setQuery(data.query);
        return;
      }

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, platforms: selectedPlatforms, skipped })
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as SearchResponse;
      setMovies(data.movies);
      setQuery(data.query);
    } catch {
      const data = localRecommend(mood, selectedPlatforms, skipped);
      setMovies(data.movies);
      setQuery(data.query);
      setError("Live APIs unavailable, using curated mood matching.");
    } finally {
      setLoading(false);
    }
  }

  function togglePlatform(platform: string) {
    setSelectedPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
    );
  }

  function skipMovie(movie: Movie) {
    x.set(0);
    setSkipped((current) => [...current, movie.id]);
    setMovies((current) => current.filter((item) => item.id !== movie.id));
    setMood((current) => ({
      ...current,
      complexity: Math.max(0, current.complexity - 4),
      pace: Math.min(100, current.pace + 3)
    }));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-cinema-black px-4 py-5 text-slate-50 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-5 lg:h-[calc(100vh-40px)]">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.12] bg-white/[0.08] shadow-redglow backdrop-blur">
              <Clapperboard className="h-6 w-6 text-cinema-red" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-normal sm:text-5xl">CineMood</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Tune the feeling. Let the algorithm pick the movie.
              </p>
            </div>
          </div>
          <div className="rounded-full border border-cinema-blue/30 bg-cinema-blue/10 px-4 py-2 text-sm text-cinema-blue shadow-neon">
            Mood intensity {intensity}%
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-white/10 bg-cinema-panel p-4 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Mood Dashboard</h2>
              <Sparkles className="h-5 w-5 text-cinema-blue" />
            </div>

            <div className="grid h-72 grid-cols-4 gap-3 sm:h-80">
              {sliders.map((slider) => (
                <div
                  key={slider.key}
                  className="flex min-w-0 flex-col items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-3"
                >
                  <span className="text-xs font-semibold uppercase text-slate-300">{slider.label}</span>
                  <input
                    aria-label={slider.label}
                    className="vertical-slider h-44 w-8 cursor-pointer sm:h-52"
                    max={100}
                    min={0}
                    style={{ "--slider-color": slider.color } as CSSProperties}
                    type="range"
                    value={mood[slider.key]}
                    onChange={(event) =>
                      setMood((current) => ({ ...current, [slider.key]: Number(event.target.value) }))
                    }
                  />
                  <div className="text-center">
                    <div className="text-lg font-black" style={{ color: slider.color }}>
                      {mood[slider.key]}
                    </div>
                    <div className="mt-1 text-[10px] uppercase text-slate-500">
                      {mood[slider.key] > 50 ? slider.high : slider.low}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-slate-200">Watch on my platforms</h3>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <label
                    key={platform}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-white/20"
                  >
                    <input
                      checked={selectedPlatforms.includes(platform)}
                      className="h-4 w-4 accent-cinema-red"
                      type="checkbox"
                      onChange={() => togglePlatform(platform)}
                    />
                    <span className="truncate">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-cinema-red px-4 py-3 font-bold text-white shadow-redglow transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              onClick={findMovies}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              Magic Search
            </button>
            {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          </aside>

          <section className="flex min-h-0 flex-col gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase text-cinema-blue">OpenAI query</p>
              <p className="mt-1 text-xl font-semibold text-white">{query}</p>
            </div>

            <div className="hidden min-h-0 flex-1 flex-col justify-center lg:flex">
              <div className="poster-mask no-scrollbar flex gap-5 overflow-x-auto px-8 py-8">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center lg:hidden">
              <AnimatePresence mode="popLayout">
                {activeMovie ? (
                  <motion.div
                    key={activeMovie.id}
                    className="w-full max-w-sm touch-none"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.x) > 110) {
                        skipMovie(activeMovie);
                      }
                    }}
                    style={{ x, rotate, opacity }}
                    exit={{ x: -260, opacity: 0, scale: 0.92 }}
                  >
                    <MovieCard movie={activeMovie} mobile onSkip={() => skipMovie(activeMovie)} />
                  </motion.div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center text-slate-300">
                    All caught up. Run Magic Search again.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function MovieCard({ movie, mobile = false, onSkip }: { movie: Movie; mobile?: boolean; onSkip?: () => void }) {
  return (
    <motion.article
      className={`group relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl ${
        mobile ? "w-full" : "w-64"
      }`}
      whileHover={{ scale: mobile ? 1 : 1.08, y: mobile ? 0 : -12 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="relative aspect-[2/3] w-full">
        <PosterArt movie={movie} />
        <div
          className={`absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur transition ${
            mobile
              ? "opacity-100"
              : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-cinema-red text-[10px]">
            {movie.provider.slice(0, 1)}
          </span>
          Available on {movie.provider}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-black text-white">{movie.title}</h3>
              <p className="text-sm text-slate-300">
                {movie.year} - {movie.rating.toFixed(1)}
              </p>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-slate-300 opacity-0 transition group-hover:opacity-100 sm:opacity-100">
            {movie.matchReason}
          </p>
          <div className="mt-4 flex gap-2">
            <a
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cinema-blue px-3 py-2 text-sm font-black text-black transition hover:bg-sky-300"
              href={movie.watchUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Play className="h-4 w-4 fill-black" />
              Watch Now
            </a>
            {mobile && onSkip ? (
              <button
                aria-label="Skip movie"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10"
                onClick={onSkip}
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PosterArt({ movie }: { movie: Movie }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,209,255,0.28),_transparent_42%),linear-gradient(160deg,_rgba(229,9,20,0.22),_rgba(5,5,5,0.95)_68%)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-x-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Curated pick
        </div>
        <div className="absolute inset-x-4 bottom-20">
          <p className="text-3xl font-black leading-tight text-white">{movie.title}</p>
          <p className="mt-2 text-sm text-slate-300">{movie.overview}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Image
        alt={`${movie.title} poster`}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 90vw, 260px"
        src={movie.poster}
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
    </>
  );
}
