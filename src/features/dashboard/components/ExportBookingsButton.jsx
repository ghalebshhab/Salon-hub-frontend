import { Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useExportBookings from "../hooks/useExportBookings.js";

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
        title="CSV export is part of the Business plan"
      >
        <Lock size={14} aria-hidden="true" />
        Export CSV
        <span className="owner-export-plan">Business</span>
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
      title={`Download the bookings of ${range.toLowerCase()} as a CSV file`}
    >
      <Download size={14} aria-hidden="true" />
      {busy ? "Exporting…" : "Export CSV"}
    </button>
  );
}
