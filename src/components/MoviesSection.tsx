import { useState } from 'react'
import { Clapperboard } from 'lucide-react'
import { tmdb } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'
import { SectionHeading } from './SectionHeading'
import { TabPills } from './TabPills'
import { ScrollRow } from './ScrollRow'
import type { MediaItem, MediaType, MovieCategory } from '../types/tmdb'

const CATEGORIES: { value: MovieCategory; label: string }[] = [
  { value: 'now_playing', label: 'Now Playing' },
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'upcoming', label: 'Upcoming' },
]

interface MoviesSectionProps {
  onSelect: (item: MediaItem, mediaType: MediaType) => void
}

export function MoviesSection({ onSelect }: MoviesSectionProps) {
  const [category, setCategory] = useState<MovieCategory>('now_playing')
  const { items, loading, error } = useMediaList(() => tmdb.movieCategory(category), [category])

  return (
    <section id="Movies" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="On the big screen"
        title="Movies"
        description="Explore popular, top rated, upcoming and now playing movies."
        action={<TabPills options={CATEGORIES} active={category} onChange={setCategory} />}
      />
      {error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollRow items={items} mediaType="movie" onSelect={onSelect} loading={loading} emptyLabel="No movies found." />
      )}
    </section>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-void-line bg-void-surface px-4 py-4 text-sm text-ink-dim">
      <Clapperboard size={18} className="mt-0.5 shrink-0 text-marquee-gold" />
      <p>{message}</p>
    </div>
  )
}
