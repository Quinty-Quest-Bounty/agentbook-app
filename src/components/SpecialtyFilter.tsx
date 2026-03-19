import { Button } from '@/components/ui/button';

const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit'];

interface SpecialtyFilterProps {
  selected: string;
  onChange: (specialty: string) => void;
}

export function SpecialtyFilter({ selected, onChange }: SpecialtyFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SPECIALTIES.map((specialty) => {
        const isActive = (specialty === 'All' && selected === '') || selected === specialty;
        return (
          <Button
            key={specialty}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(specialty === 'All' ? '' : specialty)}
            className={`rounded-full whitespace-nowrap ${
              isActive ? 'shadow-[0_0_16px_var(--accent-glow)]' : ''
            }`}
          >
            {specialty}
          </Button>
        );
      })}
    </div>
  );
}
