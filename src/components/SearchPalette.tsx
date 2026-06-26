import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Film, Search, Star, Tv, X } from 'lucide-react'
import { tmdb, imageUrl } from '../lib/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import type { MediaItem, MediaType } from '../types/tmdb'

interface SearchPaletteProps {
  open: boolean
  onClose: () => void
  onSelect: (item: MediaItem, mediaType: MediaType) => void
}

export function SearchPalette({ open, onClose, onSelect }: SearchPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounced = useDebounce(query, 350)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)
    tmdb
      .searchMulti(debounced.trim())
      .then((res) => {
        if (!cancelled) {
          setResults(res.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv'))
        }
      })
      .catch((err: Error) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [debounced])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-lg bg-void-surface ring-1 ring-void-line"
          >
            <div className="flex items-center gap-3 border-b border-void-line px-4 py-3">
              <Search size={18} className="text-ink-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, series..."
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button onClick={onClose} aria-label="Close search" className="text-ink-faint hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {loading && (
                <p className="px-3 py-6 text-center font-mono text-xs text-ink-faint">Searching…</p>
              )}
              {error && <p className="px-3 py-6 text-center text-xs text-red-400">{error}</p>}
              {!loading && !error && debounced && results.length === 0 && (
                <p className="px-3 py-6 text-center font-mono text-xs text-ink-faint">
                  No results for "{debounced}"
                </p>
              )}
              {!debounced && !loading && (
                <p className="px-3 py-6 text-center font-mono text-xs text-ink-faint">
                  Type to search across movies and TV series.
                </p>
              )}

              {results.map((item) => {
                const title = item.title ?? item.name ?? 'Untitled'
                const poster = imageUrl(item.poster_path, 'w200')
                const mediaType = (item.media_type ?? 'movie') as MediaType
                return (
                  <button
                    key={`${mediaType}-${item.id}`}
                    onClick={() => {
                      onSelect(item, mediaType)
                      onClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-void-raised"
                  >
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded-sm bg-void-raised">
                      {poster && <img src={poster} alt={title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{title}</p>
                      <p className="flex items-center gap-1 font-mono text-[11px] text-ink-faint">
                        {mediaType === 'movie' ? <Film size={11} /> : <Tv size={11} />}
                        {mediaType === 'movie' ? 'Movie' : 'Series'}
                      </p>
                    </div>
                    {item.vote_average > 0 && (
                      <span className="flex items-center gap-0.5 font-mono text-[11px] text-marquee-amber">
                        <Star size={10} fill="currentColor" /> {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
