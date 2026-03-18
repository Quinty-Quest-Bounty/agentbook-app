interface RatingStarsProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
};

export function RatingStars({ rating, interactive = false, onChange, size = 'md' }: RatingStarsProps) {
  return (
    <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            star <= rating ? 'text-[var(--star-color)]' : 'text-gray-600'
          }`}
          onClick={() => interactive && onChange?.(star)}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${star} stars` : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}
