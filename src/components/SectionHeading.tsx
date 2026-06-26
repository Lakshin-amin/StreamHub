import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-marquee text-marquee-gold">{eyebrow}</p>
        <h2 className="font-display text-3xl uppercase tracking-marquee text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-1 max-w-xl text-sm text-ink-dim">{description}</p>}
      </div>
      {action}
    </div>
  )
}
