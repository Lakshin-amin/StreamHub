import { useState } from 'react'
import { tmdb } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'
import { SectionHeading } from './SectionHeading'
import { TabPills } from './TabPills'
import { ScrollRow } from './ScrollRow'
import { ErrorState } from './MoviesSection'
import type { MediaItem, MediaType } from '../types/tmdb'

interface TrendingSectionProps {
  onSelect: (item: MediaItem, mediaType: MediaType) => void
}

const TABS: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Movie' },
  { value: 'tv', label: 'TV' },
]

export function TrendingSection({ onSelect }: TrendingSectionProps) {
  const [mediaType, setMediaType] = useState<MediaType>('movie')
  const { items, loading, error } = useMediaList(() => tmdb.trending(mediaType, 'week'), [mediaType])

  return (
    <section id="Trending" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="This week's signal"
        title="Trending"
        description="What everyone is watching right now, refreshed weekly."
        action={<TabPills options={TABS} active={mediaType} onChange={setMediaType} />}
      />
      {error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollRow items={items} mediaType={mediaType} onSelect={onSelect} loading={loading} />
      )}
    </section>
  )
}
