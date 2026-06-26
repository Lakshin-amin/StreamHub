import { History, X } from 'lucide-react'
import { imageUrl } from '../lib/tmdb'
import type { ContinueWatchingEntry, MediaItem, MediaType } from '../types/tmdb'

interface ContinueWatchingProps {
  entries: ContinueWatchingEntry[]
  onSelect: (item: MediaItem, mediaType: MediaType) => void
  onRemove: (id: number, mediaType: MediaType) => void
}

export function ContinueWatching({ entries, onSelect, onRemove }: ContinueWatchingProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-5">
        <p className="font-mono text-[11px] uppercase tracking-marquee text-marquee-gold">Pick up where you left off</p>
        <h2 className="font-display text-3xl uppercase tracking-marquee text-ink sm:text-4xl">History</h2>
        <p className="mt-1 max-w-xl text-sm text-ink-dim">
          Continue watching your recently opened movies and episodes.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-void-line px-6 py-12 text-center">
          <History size={22} className="text-ink-faint" />
          <p className="font-display text-lg uppercase tracking-wide text-ink-dim">No History Yet</p>
          <p className="max-w-sm text-xs text-ink-faint">
            Start watching a movie or episode and it will appear here.
          </p>
        </div>
      ) : (
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-1">
          {entries.map((entry) => {
            const poster = imageUrl(entry.poster_path, 'w300')
            return (
              <div key={`${entry.media_type}-${entry.id}`} className="group relative w-[160px] shrink-0 snap-start sm:w-[180px]">
                <button
                  onClick={() =>
                    onSelect(
                      { id: entry.id, title: entry.title, name: entry.title, poster_path: entry.poster_path, backdrop_path: entry.backdrop_path, overview: '', vote_average: 0, vote_count: 0, genre_ids: [], popularity: 0 },
                      entry.media_type
                    )
                  }
                  className="block w-full text-left focus:outline-none"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-void-raised ring-1 ring-void-line">
                    {poster ? (
                      <img src={poster} alt={entry.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-ink-faint">
                        NO ARTWORK
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
                      <div className="h-full bg-marquee-gold" style={{ width: `${entry.progress}%` }} />
                    </div>
                  </div>
                  <h3 className="mt-2 truncate text-sm font-medium text-ink">{entry.title}</h3>
                  <p className="font-mono text-[11px] text-ink-faint">{entry.progress}% watched</p>
                </button>
                <button
                  onClick={() => onRemove(entry.id, entry.media_type)}
                  aria-label={`Remove ${entry.title} from history`}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-ink-dim opacity-0 transition-opacity group-hover:opacity-100 hover:text-ink"
                >
                  <X size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
