import { ImagePlus, LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { showWarningToast } from "../notifications/toast.jsx";
import t from "../i18n/t.js";

const IMAGE_LIMIT = 8 * 1024 * 1024;
const VIDEO_LIMIT = 40 * 1024 * 1024;

/**
 * Opens the device photo picker. On a PC or laptop the browser opens the
 * system file window (Windows starts in Pictures or the last used folder).
 * On phones, "image/*" opens the Photos / Gallery app.
 */
export default function PhotoPickerButton({
  label = t("Choose photo"),
  allowVideo = false,
  busy = false,
  busyLabel = t("Uploading…"),
  className = "media-device-button",
  onSelect,
}) {
  const inputRef = useRef(null);

  const choose = (file) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    const video = file.type.startsWith("video/");
    if ((!video && !file.type.startsWith("image/")) || (video && !allowVideo)) {
      showWarningToast(
        allowVideo ? t("Choose a photo or video.") : t("Choose a photo."),
      );
      return;
    }
    if (file.size > (video ? VIDEO_LIMIT : IMAGE_LIMIT)) {
      showWarningToast(
        video
          ? t("Videos must be 40 MB or smaller.")
          : t("Photos must be 8 MB or smaller."),
      );
      return;
    }
    onSelect?.(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={allowVideo ? "image/*,video/*" : "image/*"}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => choose(event.target.files?.[0])}
      />
      <button
        type="button"
        className={className}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? (
          <LoaderCircle
            size={18}
            className="community-spinning"
            aria-hidden="true"
          />
        ) : (
          <ImagePlus size={18} aria-hidden="true" />
        )}
        {busy ? busyLabel : label}
      </button>
    </>
  );
}
