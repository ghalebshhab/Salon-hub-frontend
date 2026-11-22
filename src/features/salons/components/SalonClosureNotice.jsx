import { CalendarX2 } from "lucide-react";
import useSalonClosures from "../hooks/useSalonClosures.js";
import { formatDateRange, getTodayDate } from "../../bookings/model/booking.js";
import t from "../../../shared/i18n/t.js";

const MAX_SHOWN = 3;

/**
 * Public notice of the salon's upcoming closures. Renders nothing while it
 * loads or when no closure is planned, so the page never jumps for most salons.
 */
export default function SalonClosureNotice({ salonId }) {
  const { items } = useSalonClosures(salonId);
  if (!items.length) return null;

  const today = getTodayDate();
  const closedNow = items.find(
    (item) => item.startDate <= today && item.endDate >= today,
  );
  const shown = items.slice(0, MAX_SHOWN);

  return (
    <aside
      className={`salon-closure-notice ${closedNow ? "is-now" : ""}`}
      aria-label={t("Salon closures")}
    >
      <CalendarX2 size={18} aria-hidden="true" />
      <div>
        <strong>
          {closedNow
            ? t("Closed today{value}", {
                value:
                  closedNow.endDate !== today
                    ? t(" until {dateRange}", {
                        dateRange: formatDateRange(closedNow.endDate),
                      })
                    : "",
              })
            : t("Closed on some upcoming days")}
        </strong>
        <ul>
          {shown.map((item) => (
            <li key={item.id}>
              {formatDateRange(item.startDate, item.endDate)}
              {item.reason ? ` · ${item.reason}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
