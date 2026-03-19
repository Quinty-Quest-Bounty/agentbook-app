interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'text-xs', md: 'text-base', lg: 'text-2xl' }

export function RatingStars({ rating, interactive = false, onChange, size = 'md' }: RatingStarsProps) {
  return (
    <div className={`flex gap-px ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${star <= rating ? 'text-star' : 'text-border'}`}
          onClick={() => interactive && onChange?.(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}
