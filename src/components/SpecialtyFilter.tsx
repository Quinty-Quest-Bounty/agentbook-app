const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']

interface Props {
  selected: string
  onChange: (s: string) => void
}

export function SpecialtyFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none">
      {SPECIALTIES.map((s) => {
        const value = s === 'All' ? '' : s.toLowerCase()
        const isActive = selected === value
        return (
          <button
            key={s}
            onClick={() => onChange(value)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
