# CineMood

The Emotional Movie Finder: a dark, glassmorphism Next.js app that recommends movies from mood sliders instead of genres.

## Setup

1. Install Node.js 20 LTS or newer.
2. Install dependencies:

```bash
npm install
```

3. Optional API keys:

```bash
cp .env.example .env.local
```

Then set:

- `OPENAI_API_KEY` for mood-to-query matching.
- `TMDB_API_KEY` for live movie discovery.
- `WATCHMODE_API_KEY` for streaming availability.

Without keys, the app still runs with curated fallback movies.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Infrastructure

Local development:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run typecheck
npm run build
npm run start
```

Docker production:

```bash
docker compose up --build
```

Docker development with hot reload:

```bash
docker compose -f compose.dev.yml up
```

The production image uses Next.js standalone output and listens on port `3000`.

## GitHub Pages

Static deployment is handled by `.github/workflows/pages.yml` on every push to `main`.

The workflow can read these GitHub Actions secrets at build time:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `TMDB_API_KEY`
- `TMDB_BEARER_TOKEN`
- `WATCHMODE_API_KEY`
- `LETTERBOXD_CLIENT_ID`
- `LETTERBOXD_CLIENT_SECRET`
- `LETTERBOXD_USERNAME`

GitHub Pages does not run Next.js API routes. For this deployment target, Magic Search uses the client-side recommender from `lib/recommendation-engine.ts`, which ranks a larger curated catalog from the slider values and selected platforms. The server-side handler remains in `server/recommend-route.ts` for a future Node/Vercel/container deployment.

That means GitHub Actions secrets are available during the build, but they do not turn GitHub Pages into a live server runtime. To use TMDB/OpenAI/Watchmode at request time, deploy the app to a Node-capable platform such as Vercel or a container host.
Expected URL:

```text
https://feuille2infra.github.io/CineMood/
```
