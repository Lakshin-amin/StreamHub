import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaCard } from './MediaCard'
import type { MediaItem, MediaType } from '../types/tmdb'

interface ScrollRowProps {
  items: MediaItem[]
  mediaType: MediaType
  onSelect: (item: MediaItem, mediaType: MediaType) => void
  emptyLabel?: string
  loading?: boolean
}

export function ScrollRow({ items, mediaType, onSelect, emptyLabel, loading }: ScrollRowProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] w-[160px] shrink-0 animate-pulse rounded-md bg-void-raised sm:w-[180px]"
          />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-md border border-dashed border-void-line px-6 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-marquee text-ink-faint">
          {emptyLabel ?? 'Nothing here yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="group/row relative">
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-ink opacity-0 ring-1 ring-void-line backdrop-blur transition-opacity group-hover/row:opacity-100 sm:flex"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth pb-1"
      >
        {items.map((item) => (
          <MediaCard key={`${mediaType}-${item.id}`} item={item} mediaType={mediaType} onSelect={onSelect} />
        ))}
      </div>

      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-ink opacity-0 ring-1 ring-void-line backdrop-blur transition-opacity group-hover/row:opacity-100 sm:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
