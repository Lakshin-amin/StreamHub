import { useEffect, useState } from 'react'
import { Clapperboard, Menu, Search, X } from 'lucide-react'

const LINKS = [
  { href: '#Home', label: 'Home' },
  { href: '#Movies', label: 'Movies' },
  { href: '#Series', label: 'Series' },
  { href: '#Trending', label: 'Trending' },
  { href: '#Genres', label: 'Genres' },
]

interface NavbarProps {
  onOpenSearch: () => void
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-void/90 backdrop-blur-md ring-1 ring-void-line' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <a href="#Home" className="flex items-center gap-2 font-display text-2xl tracking-marquee text-ink">
          <Clapperboard className="text-marquee-gold" size={22} />
          LUMEN
        </a>

        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-wide text-ink-dim md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-marquee-gold">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-full bg-void-raised px-3 py-1.5 text-sm text-ink-dim ring-1 ring-void-line transition-colors hover:text-ink"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden rounded-sm bg-void-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:inline">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-ink-dim ring-1 ring-void-line md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-void-line bg-void px-4 py-3 font-mono text-sm uppercase tracking-wide text-ink-dim md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 transition-colors hover:bg-void-raised hover:text-marquee-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
