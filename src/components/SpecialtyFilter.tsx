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
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--glass-border)] hover:text-[var(--text-primary)] hover:border-[rgba(139,139,158,0.3)]'
            }`}
          >
            {specialty}
          </button>
        );
      })}
    </div>
  );
}
