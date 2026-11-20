import { getOwnerStatusLook } from "../model/dashboardFormat.js";

/** Status as words and a color tone, so meaning never depends on color only. */
export default function OwnerStatusPill({ status }) {
  const look = getOwnerStatusLook(status);
  return <span className={`owner-status tone-${look.tone}`}>{look.label}</span>;
}
