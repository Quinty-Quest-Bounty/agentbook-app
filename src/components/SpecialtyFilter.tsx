const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit'];

interface SpecialtyFilterProps {
  selected: string;
  onChange: (specialty: string) => void;
}

export function SpecialtyFilter({ selected, onChange }: SpecialtyFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {SPECIALTIES.map((specialty) => (
        <button
          key={specialty}
          onClick={() => onChange(specialty === 'All' ? '' : specialty)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            (specialty === 'All' && selected === '') || selected === specialty
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/80'
          }`}
        >
          {specialty}
        </button>
      ))}
    </div>
  );
}
