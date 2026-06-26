import { useState } from 'react'
import { Clapperboard, Mail } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <footer className="border-t border-void-line bg-void-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-2xl tracking-marquee text-ink">
              <Clapperboard className="text-marquee-gold" size={20} />
              LUMEN
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-dim">
              Built for discovering what to watch next — trending titles, top rated shows and
              genre collections in one cinematic interface.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-dim">
              {[
                ['Movies', '#Movies'],
                ['Series', '#Series'],
                ['Trending', '#Trending'],
                ['Genres', '#Genres'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-marquee-gold">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-dim">
              {['Safe browsing', 'Privacy', 'Terms', 'Cookies'].map((label) => (
                <li key={label}>
                  <span className="cursor-default transition-colors hover:text-ink">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">Weekly picks</p>
            <p className="mt-3 text-sm text-ink-dim">
              New releases, trending titles, hidden gems and genre picks — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setSubmitted(true)
              }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="flex flex-1 items-center gap-2 rounded-md bg-void-raised px-3 py-2 ring-1 ring-void-line">
                <Mail size={14} className="text-ink-faint" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-md bg-marquee-gold px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-void"
              >
                Join
              </button>
            </form>
            {submitted && (
              <p className="mt-2 font-mono text-[11px] text-marquee-amber">You're on the list — welcome aboard.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-void-line pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Lumen. All rights reserved.</p>
          <p className="font-mono">Built with the TMDB API. Not affiliated with TMDB.</p>
        </div>
      </div>
    </footer>
  )
}
