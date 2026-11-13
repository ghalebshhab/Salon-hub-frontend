import { Scissors } from "lucide-react";
import { salonInitials } from "../model/salonInitials.js";

// Branded stand-in for salons without a cover image. Decorative only:
// the salon name is always rendered as text next to it.
export default function SalonCoverPlaceholder({ name, variant = "card" }) {
  return (
    <div
      className={`salon-cover-art is-${variant}`}
      aria-hidden="true"
    >
      <Scissors className="salon-cover-art-mark" />
      <span className="salon-cover-art-initials">
        {salonInitials(name)}
      </span>
      <span className="salon-cover-art-rule" />
    </div>
  );
}
