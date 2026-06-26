import { useState } from 'react'
import { tmdb } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'
import { SectionHeading } from './SectionHeading'
import { TabPills } from './TabPills'
import { ScrollRow } from './ScrollRow'
import { ErrorState } from './MoviesSection'
import type { MediaItem, MediaType, TVCategory } from '../types/tmdb'

const CATEGORIES: { value: TVCategory; label: string }[] = [
  { value: 'airing_today', label: 'Airing Today' },
  { value: 'on_the_air', label: 'On The Air' },
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
]

interface TVSectionProps {
  onSelect: (item: MediaItem, mediaType: MediaType) => void
}

export function TVSection({ onSelect }: TVSectionProps) {
  const [category, setCategory] = useState<TVCategory>('popular')
  const { items, loading, error } = useMediaList(() => tmdb.tvCategory(category), [category])

  return (
    <section id="Series" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Episodic obsessions"
        title="TV Series"
        description="Explore popular, top rated, upcoming and now playing TV series."
        action={<TabPills options={CATEGORIES} active={category} onChange={setCategory} />}
      />
      {error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollRow items={items} mediaType="tv" onSelect={onSelect} loading={loading} emptyLabel="No series found." />
      )}
    </section>
  )
}
