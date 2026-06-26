import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { tmdb, imageUrl } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'

const ROTATE_MS = 7000

export function Hero() {
  const { items } = useMediaList(() => tmdb.trending('movie', 'week'), [])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (items.length < 2) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % Math.min(items.length, 6)), ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [items.length])

  const current = items[active]
  const backdrop = current ? imageUrl(current.backdrop_path, 'original') : null

  return (
    <section id="Home" className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {backdrop && (
            <motion.img
              key={current.id}
              src={backdrop}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/40 to-transparent" />
        <div className="absolute inset-0 bg-film-grain opacity-[0.06] mix-blend-overlay" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-marquee text-marquee-gold">
            Premium streaming discovery
          </p>
          <h1 className="text-balance font-display text-5xl uppercase leading-[0.95] tracking-marquee text-ink sm:text-6xl md:text-7xl">
            Find your
            <br />
            next obsession
            <br />
            <span className="text-marquee-gold">faster.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-dim">
            Browse trending titles, top rated series, genre collections and fresh releases — all in
            one cinematic discovery experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#Movies"
              className="ticket-btn relative inline-flex items-center gap-2 rounded-md bg-marquee-gold px-7 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-void transition-transform hover:-translate-y-0.5"
            >
              Start Exploring
              <ArrowRight size={16} />
            </a>

            {current && (
              <div className="flex items-center gap-2 rounded-md bg-black/40 px-3.5 py-2.5 ring-1 ring-void-line backdrop-blur-sm">
                <Star size={14} className="text-marquee-amber" fill="currentColor" />
                <span className="font-mono text-xs text-ink-dim">
                  Featured —{' '}
                  <span className="text-ink">{current.title}</span> ·{' '}
                  {current.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <dl className="mt-12 flex gap-8">
            {[
              ['10K+', 'Movies'],
              ['5K+', 'TV Series'],
              ['HD', 'Quality'],
            ].map(([value, label]) => (
              <div key={label}>
                <dd className="font-display text-3xl text-ink">{value}</dd>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
