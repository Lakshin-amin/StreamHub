import type {
  GenreListResponse,
  MediaDetail,
  MediaListResponse,
  MediaType,
  MovieCategory,
  TVCategory,
} from '../types/tmdb'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export class TmdbConfigError extends Error {}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new TmdbConfigError(
      'Missing VITE_TMDB_API_KEY. Add your TMDB API key to a .env.local file to load real data.'
    )
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export function imageUrl(
  path: string | null,
  size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export const tmdb = {
  isConfigured: () => Boolean(API_KEY),

  trending: (mediaType: MediaType | 'all', timeWindow: 'day' | 'week' = 'week') =>
    tmdbFetch<MediaListResponse>(`/trending/${mediaType}/${timeWindow}`),

  movieCategory: (category: MovieCategory, page = 1) =>
    tmdbFetch<MediaListResponse>(`/movie/${category}`, { page: String(page) }),

  tvCategory: (category: TVCategory, page = 1) =>
    tmdbFetch<MediaListResponse>(`/tv/${category}`, { page: String(page) }),

  genres: (mediaType: MediaType) =>
    tmdbFetch<GenreListResponse>(`/genre/${mediaType}/list`),

  discoverByGenre: (mediaType: MediaType, genreId: number, page = 1) =>
    tmdbFetch<MediaListResponse>(`/discover/${mediaType}`, {
      with_genres: String(genreId),
      page: String(page),
      sort_by: 'popularity.desc',
    }),

  searchMulti: (query: string) =>
    tmdbFetch<MediaListResponse>('/search/multi', { query, include_adult: 'false' }),

  details: (mediaType: MediaType, id: number) =>
    tmdbFetch<MediaDetail>(`/${mediaType}/${id}`, { append_to_response: 'videos,credits' }),
}
