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
          <button
            key={specialty}
            onClick={() => onChange(specialty === 'All' ? '' : specialty)}
            className="px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200"
            style={isActive
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 16px var(--accent-glow)' }
              : { background: 'var(--input-bg)', color: 'var(--text-secondary)', border: '1px solid var(--input-border)' }
            }
          >
            {specialty}
          </button>
        );
      })}
    </div>
  );
}
