import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Calendar, Clock, Star, X } from 'lucide-react'
import { tmdb, imageUrl } from '../lib/tmdb'
import type { MediaDetail, MediaItem, MediaType } from '../types/tmdb'

interface DetailModalProps {
  item: MediaItem | null
  mediaType: MediaType | null
  onClose: () => void
  onTrack: (item: MediaItem, mediaType: MediaType) => void
}

export function DetailModal({ item, mediaType, onClose, onTrack }: DetailModalProps) {
  const [detail, setDetail] = useState<MediaDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!item || !mediaType) {
      setDetail(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    tmdb
      .details(mediaType, item.id)
      .then((res) => !cancelled && setDetail(res))
      .catch((err: Error) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [item, mediaType])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (item) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [item, onClose])

  const open = Boolean(item && mediaType)
  const title = item?.title ?? item?.name ?? ''
  const trailer = detail?.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) ?? detail?.videos?.results.find((v) => v.site === 'YouTube')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-void-surface ring-1 ring-void-line"
          >
            <div className="relative">
              {item?.backdrop_path && (
                <img
                  src={imageUrl(item.backdrop_path, 'w780') ?? undefined}
                  alt=""
                  className="h-48 w-full object-cover sm:h-64"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void-surface via-void-surface/20 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-ink hover:bg-black/80"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pb-6 pt-2 sm:px-7">
              <h2 className="font-display text-3xl uppercase tracking-marquee text-ink">{title}</h2>
              {detail?.tagline && <p className="mt-1 text-sm italic text-ink-faint">{detail.tagline}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-ink-dim">
                {item && item.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-marquee-amber">
                    <Star size={13} fill="currentColor" /> {item.vote_average.toFixed(1)}
                  </span>
                )}
                {(item?.release_date || item?.first_air_date) && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {(item.release_date ?? item.first_air_date)?.slice(0, 4)}
                  </span>
                )}
                {(detail?.runtime || detail?.episode_run_time?.[0]) && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {detail?.runtime ?? detail?.episode_run_time?.[0]} min
                  </span>
                )}
                {detail?.number_of_seasons && (
                  <span>{detail.number_of_seasons} season{detail.number_of_seasons > 1 ? 's' : ''}</span>
                )}
              </div>

              {detail?.genres && detail.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full bg-void-raised px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-dim ring-1 ring-void-line"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {loading && <p className="mt-5 font-mono text-xs text-ink-faint">Loading details…</p>}
              {error && <p className="mt-5 text-xs text-red-400">{error}</p>}

              <p className="mt-5 text-sm leading-relaxed text-ink-dim">
                {detail?.overview || item?.overview || 'No synopsis available for this title.'}
              </p>

              {trailer && (
                <div className="mt-5 aspect-video w-full overflow-hidden rounded-md ring-1 ring-void-line">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}

              {detail?.credits?.cast && detail.credits.cast.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-faint">Cast</p>
                  <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                    {detail.credits.cast.slice(0, 10).map((member) => (
                      <div key={member.id} className="w-16 shrink-0 text-center">
                        <div className="aspect-square overflow-hidden rounded-full bg-void-raised ring-1 ring-void-line">
                          {member.profile_path && (
                            <img
                              src={imageUrl(member.profile_path, 'w200') ?? undefined}
                              alt={member.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <p className="mt-1 truncate text-[11px] text-ink-dim">{member.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => item && mediaType && onTrack(item, mediaType)}
                className="mt-7 flex items-center gap-2 rounded-md bg-marquee-gold px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-void transition-transform hover:-translate-y-0.5"
              >
                <Bookmark size={14} /> Add to History
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
