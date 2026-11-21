import { Scissors } from "lucide-react";
import { salonInitials } from "../model/salonInitials.js";

/**
 * The salon page monogram: a round emblem with the initials and a short
 * statement about the salon inside it, like a hand-pressed salon stamp.
 */
function MonogramEmblem({ name, statement }) {
  return (
    <div className="salon-emblem">
      <span className="salon-emblem-kicker">{statement.kicker}</span>
      <span className="salon-emblem-initials">{salonInitials(name)}</span>
      <span className="salon-emblem-rule">
        <Scissors aria-hidden="true" />
      </span>
      <span className="salon-emblem-statement">{statement.text}</span>
    </div>
  );
}

// Branded stand-in for salons without a cover image. Decorative only:
// the salon name and the statement facts are always rendered as text
// elsewhere on the page.
export default function SalonCoverPlaceholder({
  name,
  variant = "card",
  statement = null,
}) {
  if (statement) {
    return (
      <div
        className={`salon-cover-art is-${variant} has-emblem`}
        aria-hidden="true"
      >
        <MonogramEmblem name={name} statement={statement} />
      </div>
    );
  }
  return (
    <div className={`salon-cover-art is-${variant}`} aria-hidden="true">
      <Scissors className="salon-cover-art-mark" />
      <span className="salon-cover-art-initials">{salonInitials(name)}</span>
      <span className="salon-cover-art-rule" />
    </div>
  );
}
