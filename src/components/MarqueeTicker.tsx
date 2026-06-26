import { Star } from 'lucide-react'
import { tmdb } from '../lib/tmdb'
import { useMediaList } from '../hooks/useMediaList'

export function MarqueeTicker() {
  const { items, error } = useMediaList(() => tmdb.trending('all', 'day'), [])

  if (error || !items.length) return null

  const renderItems = (keyPrefix: string) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${item.id}-${i}`} className="mx-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-marquee text-ink-dim">
        <span className="text-ink">{item.title ?? item.name}</span>
        <span className="inline-flex items-center gap-0.5 text-marquee-amber">
          <Star size={10} fill="currentColor" /> {item.vote_average.toFixed(1)}
        </span>
        <span className="text-void-line">●</span>
      </span>
    ))

  return (
    <div className="relative overflow-hidden border-y border-void-line bg-void-surface py-2.5">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {renderItems('a')}
        {renderItems('b')}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-void to-transparent" />
    </div>
  )
}
