interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({
  rating,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-500">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-current`}
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        {/* Half Star */}
        {hasHalfStar && (
          <svg
            className={`${sizeClasses[size]}`}
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <defs>
              <linearGradient id="halfGrad">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill="url(#halfGrad)"
              stroke="currentColor"
              strokeWidth="1"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        )}
        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-yellow-500`}
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        ))}
      </div>
      {showValue && (
        <span className="font-bold text-foreground ml-1">{rating}</span>
      )}
    </div>
  );
}
