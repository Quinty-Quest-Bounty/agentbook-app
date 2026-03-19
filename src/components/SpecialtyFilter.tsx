const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']

interface Props {
  selected: string
  onChange: (s: string) => void
}

export function SpecialtyFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
      {SPECIALTIES.map((s) => {
        const value = s === 'All' ? '' : s.toLowerCase()
        const isActive = selected === value
        return (
          <button
            key={s}
            onClick={() => onChange(value)}
            className={`px-3 py-1.5 rounded text-[11px] font-medium whitespace-nowrap transition-all shrink-0 border ${
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
