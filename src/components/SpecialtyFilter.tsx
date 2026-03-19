import { Button } from '@/components/ui/button'

const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']

interface Props {
  selected: string
  onChange: (s: string) => void
}

export function SpecialtyFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SPECIALTIES.map((s) => {
        const isActive = (s === 'All' && selected === '') || selected === s
        return (
          <Button
            key={s}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(s === 'All' ? '' : s)}
            className="rounded-full shrink-0"
          >
            {s}
          </Button>
        )
      })}
    </div>
  )
}
