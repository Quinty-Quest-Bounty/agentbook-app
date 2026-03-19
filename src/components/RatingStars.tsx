interface RatingStarsProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-[13px] gap-0.5',
  md: 'text-xl gap-1',
  lg: 'text-4xl gap-1.5',
};

export function RatingStars({ rating, interactive = false, onChange, size = 'md' }: RatingStarsProps) {
  return (
    <div className={`flex ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${interactive ? 'cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-150' : ''} ${
            star <= rating ? 'text-star' : 'text-muted'
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
