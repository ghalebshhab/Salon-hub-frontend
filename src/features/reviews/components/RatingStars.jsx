import { Star } from "lucide-react";

function RatingStars({ rating = 0, onChange, readonly = false, size = 20 }) {
  const handleClick = (value) => {
    if (readonly) return;

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={value <= rating ? "star-button active" : "star-button"}
          onClick={() => handleClick(value)}
          disabled={readonly}
        >
          <Star size={size} fill={value <= rating ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
