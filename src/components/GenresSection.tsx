import { useEffect, useState } from 'react'
import { tmdb } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'
import { SectionHeading } from './SectionHeading'
import { ScrollRow } from './ScrollRow'
import { ErrorState } from './MoviesSection'
import type { Genre, MediaItem, MediaType } from '../types/tmdb'

interface GenresSectionProps {
  onSelect: (item: MediaItem, mediaType: MediaType) => void
}

function useGenres(mediaType: MediaType) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    tmdb
      .genres(mediaType)
      .then((res) => {
        if (!cancelled) setGenres(res.genres)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [mediaType])

  return { genres, error }
}

function GenreColumn({
  mediaType,
  title,
  subtitle,
  selected,
  onPick,
}: {
  mediaType: MediaType
  title: string
  subtitle: string
  selected: Genre | null
  onPick: (mediaType: MediaType, genre: Genre) => void
}) {
  const { genres, error } = useGenres(mediaType)

  return (
    <div className="rounded-lg bg-void-surface p-5 ring-1 ring-void-line">
      <h3 className="font-display text-xl uppercase tracking-wide text-ink">{title}</h3>
      <p className="mb-4 text-xs text-ink-faint">{subtitle}</p>
      <p className="mb-3 font-mono text-[11px] text-ink-faint">{genres.length} Genres</p>
      {error ? (
        <ErrorState message={error} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isActive = selected?.id === genre.id
            return (
              <button
                key={genre.id}
                onClick={() => onPick(mediaType, genre)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  isActive
                    ? 'bg-signal-violet text-white'
                    : 'bg-void-raised text-ink-dim ring-1 ring-void-line hover:text-ink'
                }`}
              >
                {genre.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function GenresSection({ onSelect }: GenresSectionProps) {
  const [selected, setSelected] = useState<{ mediaType: MediaType; genre: Genre } | null>(null)
  const { items, loading, error } = useMediaList(
    () =>
      selected
        ? tmdb.discoverByGenre(selected.mediaType, selected.genre.id)
        : Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 }),
    [selected?.mediaType, selected?.genre.id]
  )

  return (
    <section id="Genres" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Browse by mood"
        title="Genres"
        description="Browse movies and TV series by mood, category and style."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <GenreColumn
          mediaType="movie"
          title="Movie Genres"
          subtitle="Find films by category"
          selected={selected?.mediaType === 'movie' ? selected.genre : null}
          onPick={(mediaType, genre) => setSelected({ mediaType, genre })}
        />
        <GenreColumn
          mediaType="tv"
          title="TV Genres"
          subtitle="Find series by category"
          selected={selected?.mediaType === 'tv' ? selected.genre : null}
          onPick={(mediaType, genre) => setSelected({ mediaType, genre })}
        />
      </div>

      {selected && (
        <div className="mt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-dim">
            Showing <span className="text-signal-violet">{selected.genre.name}</span> ·{' '}
            {selected.mediaType === 'movie' ? 'Movies' : 'TV Series'}
          </p>
          {error ? (
            <ErrorState message={error} />
          ) : (
            <ScrollRow items={items} mediaType={selected.mediaType} onSelect={onSelect} loading={loading} />
          )}
        </div>
      )}
    </section>
  )
}
