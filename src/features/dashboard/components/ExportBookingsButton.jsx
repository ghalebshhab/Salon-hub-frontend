import { Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useExportBookings from "../hooks/useExportBookings.js";
import t from "../../../shared/i18n/t.js";

/**
 * Downloads the bookings of the selected range as CSV. On plans without the
 * export it shows a locked link to the plans page instead.
 */
export default function ExportBookingsButton({ range, locked = false }) {
  const { exportBookings, busy } = useExportBookings();

  if (locked) {
    return (
      <Link
        className="owner-export-button is-locked"
        to="/owner/plan"
        title={t("CSV export is part of the Business plan")}
      >
        <Lock size={14} aria-hidden="true" />
        {t("Export CSV")}
        <span className="owner-export-plan">{t("Business")}</span>
      </Link>
    );
  }

  return (
    <button
      className="owner-export-button"
      type="button"
      onClick={() => exportBookings(range)}
      disabled={busy}
      aria-busy={busy}
      title={t("Download the bookings of {range} as a CSV file", {
        range: t(range),
      })}
    >
      <Download size={14} aria-hidden="true" />
      {busy ? t("Exporting…") : t("Export CSV")}
    </button>
  );
}
