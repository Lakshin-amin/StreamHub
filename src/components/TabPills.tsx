interface TabPillsProps<T extends string> {
  options: { value: T; label: string }[]
  active: T
  onChange: (value: T) => void
}

export function TabPills<T extends string>({ options, active, onChange }: TabPillsProps<T>) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((opt) => {
        const isActive = opt.value === active
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
              isActive
                ? 'bg-marquee-gold text-void'
                : 'bg-void-raised text-ink-dim ring-1 ring-void-line hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
