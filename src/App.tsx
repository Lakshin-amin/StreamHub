import { useCallback, useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { tmdb } from './lib/tmdb'
import { useContinueWatching } from './hooks/useContinueWatching'
import { Navbar } from './components/Navbar'
import { MarqueeTicker } from './components/MarqueeTicker'
import { Hero } from './components/Hero'
import { ContinueWatching } from './components/ContinueWatching'
import { TrendingSection } from './components/TrendingSection'
import { MoviesSection } from './components/MoviesSection'
import { TVSection } from './components/TVSection'
import { GenresSection } from './components/GenresSection'
import { Footer } from './components/Footer'
import { SearchPalette } from './components/SearchPalette'
import { DetailModal } from './components/DetailModal'
import type { MediaItem, MediaType } from './types/tmdb'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [selected, setSelected] = useState<{ item: MediaItem; mediaType: MediaType } | null>(null)
  const { entries, upsert, remove } = useContinueWatching()

  const openDetail = useCallback((item: MediaItem, mediaType: MediaType) => {
    setSelected({ item, mediaType })
  }, [])

  const closeDetail = useCallback(() => setSelected(null), [])

  const trackProgress = useCallback(
    (item: MediaItem, mediaType: MediaType) => {
      const title = item.title ?? item.name ?? 'Untitled'
      upsert({
        id: item.id,
        media_type: mediaType,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        progress: Math.floor(15 + Math.random() * 65),
      })
    },
    [upsert]
  )

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="min-h-screen bg-void">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <MarqueeTicker />

      {!tmdb.isConfigured() && <ApiKeyNotice />}

      <main>
        <Hero />
        <ContinueWatching entries={entries} onSelect={openDetail} onRemove={remove} />
        <TrendingSection onSelect={openDetail} />
        <MoviesSection onSelect={openDetail} />
        <TVSection onSelect={openDetail} />
        <GenresSection onSelect={openDetail} />
      </main>

      <Footer />

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={openDetail} />
      <DetailModal
        item={selected?.item ?? null}
        mediaType={selected?.mediaType ?? null}
        onClose={closeDetail}
        onTrack={trackProgress}
      />
    </div>
  )
}

function ApiKeyNotice() {
  return (
    <div className="mx-auto mt-4 flex max-w-7xl items-start gap-3 rounded-md bg-marquee-gold/10 px-4 py-3 ring-1 ring-marquee-gold/30 sm:mx-6">
      <TriangleAlert size={18} className="mt-0.5 shrink-0 text-marquee-gold" />
      <p className="text-sm text-ink-dim">
        No TMDB API key found. Add <code className="font-mono text-marquee-amber">VITE_TMDB_API_KEY</code>{' '}
        to a <code className="font-mono text-marquee-amber">.env.local</code> file (see README) and restart
        the dev server to load real movie and TV data.
      </p>
    </div>
  )
}
