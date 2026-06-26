export type MediaType = 'movie' | 'tv'

export interface Genre {
  id: number
  name: string
}

export interface MediaItem {
  id: number
  media_type?: MediaType
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  popularity: number
}

export interface MediaListResponse {
  page: number
  results: MediaItem[]
  total_pages: number
  total_results: number
}

export interface GenreListResponse {
  genres: Genre[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface MediaDetail extends MediaItem {
  genres: Genre[]
  runtime?: number
  episode_run_time?: number[]
  number_of_seasons?: number
  number_of_episodes?: number
  tagline?: string
  status?: string
  videos?: { results: Video[] }
  credits?: { cast: CastMember[] }
}

export interface ContinueWatchingEntry {
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
  backdrop_path: string | null
  progress: number
  updated_at: number
}

export type MovieCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'
export type TVCategory = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated'
