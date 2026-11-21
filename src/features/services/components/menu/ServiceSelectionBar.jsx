import { CalendarDays, X } from "lucide-react";
import { Link } from "react-router-dom";
import { selectionTotals } from "../../model/serviceMenu.js";

/**
 * Sticks to the bottom of the screen while the customer builds a visit:
 * how many services, total time and price, and the way to book them.
 */
export default function ServiceSelectionBar({ selected, booking, onClear }) {
  if (!selected.length) return null;
  const totals = selectionTotals(selected);
  const ids = selected.map((service) => service.id);

  return (
    <div className="menu-bar" role="region" aria-label="Your visit">
      <div className="menu-bar-copy" aria-live="polite">
        <strong>
          {totals.count} {totals.count === 1 ? "service" : "services"}
        </strong>
        <span>
          {totals.duration} · {totals.price}
        </span>
      </div>
      <button
        className="menu-bar-clear"
        type="button"
        onClick={onClear}
        aria-label="Remove all chosen services"
      >
        <X size={16} aria-hidden="true" />
      </button>
      <Link
        className="btn btn-primary menu-bar-book"
        to={booking.to}
        state={booking.state(ids)}
      >
        <CalendarDays size={16} aria-hidden="true" />
        {booking.signedIn ? "Choose a time" : "Sign in to book"}
      </Link>
    </div>
  );
}
