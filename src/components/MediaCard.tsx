import { Play, Star } from 'lucide-react'
import { imageUrl } from '../lib/tmdb'
import type { MediaItem, MediaType } from '../types/tmdb'

interface MediaCardProps {
  item: MediaItem
  mediaType: MediaType
  onSelect: (item: MediaItem, mediaType: MediaType) => void
  progress?: number
}

export function MediaCard({ item, mediaType, onSelect, progress }: MediaCardProps) {
  const title = item.title ?? item.name ?? 'Untitled'
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const poster = imageUrl(item.poster_path, 'w300')

  return (
    <button
      onClick={() => onSelect(item, mediaType)}
      className="group relative w-[160px] sm:w-[180px] shrink-0 snap-start text-left focus:outline-none"
      aria-label={`View details for ${title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-void-raised ring-1 ring-void-line transition-shadow duration-300 group-hover:shadow-glow group-focus-visible:shadow-glow">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-void-raised px-3 text-center font-mono text-xs text-ink-faint">
            NO ARTWORK
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-sm bg-marquee-gold px-2 py-0.5 font-mono text-[11px] font-semibold text-void">
            <Play size={11} fill="currentColor" /> View
          </span>
          <p className="line-clamp-3 text-xs text-ink-dim">{item.overview || 'No synopsis available.'}</p>
        </div>

        {typeof progress === 'number' && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
            <div
              className="h-full bg-marquee-gold"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}

        {item.vote_average > 0 && (
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-marquee-amber backdrop-blur-sm">
            <Star size={10} fill="currentColor" />
            {item.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      <h3 className="mt-2 truncate text-sm font-medium text-ink">{title}</h3>
      {year && <p className="font-mono text-[11px] text-ink-faint">{year}</p>}
    </button>
  )
}
