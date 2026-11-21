import { Play } from "lucide-react";
import {
  cloudinaryVideoPoster,
  optimizedCloudinaryImage,
} from "../../model/cloudinaryMedia.js";
import { altText, firstName, isVideo } from "../../model/workGallery.js";

/** One square in the mosaic. A click opens the full view. */
export default function WorkTile({ item, large = false, onOpen }) {
  const size = large ? 900 : 600;
  const video = isVideo(item);
  const poster = video
    ? cloudinaryVideoPoster(item.secureUrl, { width: size, height: size })
    : null;

  return (
    <button
      type="button"
      className={`wk-tile${large ? " is-large" : ""}`}
      onClick={onOpen}
      aria-label={`Open ${altText(item)}`}
    >
      {video && !poster ? (
        <video
          src={item.secureUrl}
          preload="metadata"
          muted
          playsInline
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : (
        <img
          src={
            video
              ? poster
              : optimizedCloudinaryImage(item.secureUrl, {
                  width: size,
                  height: size,
                })
          }
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}

      {video && (
        <span className="wk-play" aria-hidden="true">
          <Play size={large ? 22 : 18} fill="currentColor" />
        </span>
      )}

      <span className="wk-tile-info" aria-hidden="true">
        <strong>{firstName(item.employeeName)}</strong>
        {item.caption && <span>{item.caption}</span>}
      </span>
    </button>
  );
}
