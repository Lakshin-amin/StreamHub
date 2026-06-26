# Lumen — Movie & TV Discovery

A cinematic movie and TV series discovery site, built with React, TypeScript, Tailwind CSS,
and the TMDB API. Inspired by the layout of streaming-discovery apps like Astra: a marquee
hero, a trending ticker, continue-watching history, tabbed movie/TV rails, genre browsing,
and a command-palette search.

## Features

- **Hero** — rotating backdrop carousel pulled from this week's trending movies
- **Marquee ticker** — an LED-sign style strip scrolling today's trending titles + ratings
- **History** — "continue watching" row backed by `localStorage` (no backend needed)
- **Trending** — toggle between trending movies and trending TV
- **Movies** — Now Playing / Popular / Top Rated / Upcoming tabs
- **TV Series** — Airing Today / On The Air / Popular / Top Rated tabs
- **Genres** — browse by movie or TV genre, results load inline
- **Search** — `⌘K` / `Ctrl+K` command palette, debounced live search across movies + TV
- **Detail view** — synopsis, genres, cast, runtime, and embedded YouTube trailer when available

## 1. Get a free TMDB API key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings → API** and request a free **API Key (v3 auth)**
3. Copy the key

## 2. Configure your environment

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your key:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> Without a key, the site still renders — every section shows an empty/loading state and a
> banner reminds you to add one.

## 3. Install & run

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## 4. Build & deploy

```bash
npm run build
```

This outputs a static `dist/` folder — deploy it anywhere static (Vercel, Netlify, Cloudflare
Pages). On Vercel:

```bash
npm i -g vercel
vercel
```

Remember to add `VITE_TMDB_API_KEY` as an environment variable in your hosting provider's
dashboard (not just `.env.local`, which is gitignored and never deployed).

## Project structure

```
src/
  components/   UI building blocks (Navbar, Hero, sections, modals, cards)
  hooks/        useContinueWatching, useMediaList, useDebounce
  lib/tmdb.ts   Typed TMDB API client (all fetch logic lives here)
  types/tmdb.ts Shared TypeScript types
```

## Notes

- All TMDB requests happen client-side directly from the browser (TMDB's API allows CORS),
  so there's no backend or API route to deploy.
- "Continue watching" progress is simulated — clicking **Add to History** in the detail
  modal stores a randomized progress percentage in `localStorage` per title, since TMDB has
  no actual playback data.
- This project is not affiliated with TMDB or Astra. Movie and TV metadata, posters, and
  backdrops are served by [The Movie Database](https://www.themoviedb.org/) API.
