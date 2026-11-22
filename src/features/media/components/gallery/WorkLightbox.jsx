import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import useModalDialog from "../../../../shared/hooks/useModalDialog.js";
import { fittedCloudinaryImage } from "../../model/cloudinaryMedia.js";
import {
  altText,
  firstName,
  isVideo,
  postedDate,
} from "../../model/workGallery.js";
import t from "../../../../shared/i18n/t.js";

/**
 * Full view of one piece of work on a native modal <dialog>. Arrow keys
 * and the side buttons move through the list; Escape closes it.
 */
export default function WorkLightbox({
  items,
  index,
  onIndex,
  onClose,
  booking = null,
  canDelete,
  onDelete,
}) {
  const dialogRef = useModalDialog(onClose);
  const item = items[index];
  if (!item) return null;

  const count = items.length;
  const go = (step) => onIndex((index + step + count) % count);
  const onKeyDown = (event) => {
    if (count < 2) return;
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };
  const artist = firstName(item.employeeName);
  const date = postedDate(item.createdAt);

  return (
    <dialog
      ref={dialogRef}
      className="wk-lightbox"
      aria-label={t("Work {value} of {count}", { value: index + 1, count })}
      onKeyDown={onKeyDown}
    >
      <div className="wk-lightbox-stage">
        {isVideo(item) ? (
          <video
            key={item.id}
            src={item.secureUrl}
            controls
            playsInline
            preload="metadata"
            aria-label={altText(item)}
          />
        ) : (
          <img
            key={item.id}
            src={fittedCloudinaryImage(item.secureUrl, { width: 1600 })}
            alt={altText(item)}
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className="wk-nav is-prev"
              onClick={() => go(-1)}
              aria-label={t("Previous work")}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="wk-nav is-next"
              onClick={() => go(1)}
              aria-label={t("Next work")}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
        <button
          type="button"
          className="wk-close"
          onClick={onClose}
          aria-label={t("Close full view")}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="wk-lightbox-info">
        <div className="wk-lightbox-copy">
          <p className="wk-lightbox-meta">
            <strong>{item.employeeName || t("Salon team")}</strong>
            <span>{item.employeeSpecialty || t("Salon professional")}</span>
            {date && <span>{date}</span>}
          </p>
          {item.caption && (
            <p className="wk-lightbox-caption">{t(item.caption)}</p>
          )}
        </div>
        <div className="wk-lightbox-actions">
          {count > 1 && (
            <span className="wk-counter" aria-live="polite">
              {index + 1} / {count}
            </span>
          )}
          {canDelete(item) && (
            <button
              type="button"
              className="btn btn-secondary btn-small wk-delete"
              onClick={() => onDelete(item)}
            >
              <Trash2 size={15} aria-hidden="true" />
              {t("Delete")}
            </button>
          )}
          {booking && item.employeeId != null && (
            <Link
              className="btn btn-primary btn-small"
              to={booking.to}
              state={booking.state(item.employeeId)}
            >
              <CalendarDays size={15} aria-hidden="true" />
              {booking.signedIn
                ? t("Book with {artist}", { artist })
                : t("Sign in to book")}
            </Link>
          )}
        </div>
      </div>
    </dialog>
  );
}
