import { getOwnerStatusLook } from "../model/dashboardFormat.js";
import t from "../../../shared/i18n/t.js";

/** Status as words and a color tone, so meaning never depends on color only. */
export default function OwnerStatusPill({ status }) {
  const look = getOwnerStatusLook(status);
  return (
    <span className={`owner-status tone-${look.tone}`}>{t(look.label)}</span>
  );
}
