import { Cloud, ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { showWarningToast } from "../../../shared/notifications/toast.jsx";
import t from "../../../shared/i18n/t.js";

const IMAGE_LIMIT = 8 * 1024 * 1024;
const VIDEO_LIMIT = 40 * 1024 * 1024;

export default function MediaSourcePicker({
  label = t("Media"),
  currentUrl,
  allowVideo = false,
  compact = false,
  onChange,
}) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState("device");
  const [preview, setPreview] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const chooseFile = (file) => {
    if (!file) return;
    const video = file.type.startsWith("video/");
    if ((!video && !file.type.startsWith("image/")) || (video && !allowVideo)) {
      showWarningToast(
        allowVideo
          ? t("Choose an image or video.")
          : t("Choose an image file."),
      );
      return;
    }
    if (file.size > (video ? VIDEO_LIMIT : IMAGE_LIMIT)) {
      showWarningToast(
        video
          ? t("Videos must be 40 MB or smaller.")
          : t("Images must be 8 MB or smaller."),
      );
      return;
    }
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsVideo(video);
    setRemoteUrl("");
    onChange?.({
      file,
      remoteUrl: "",
      previewUrl: objectUrl,
      resourceType: video ? "VIDEO" : "IMAGE",
    });
  };

  const applyDriveUrl = () => {
    const normalized = remoteUrl.trim();
    if (!/^https:\/\/(drive|docs)\.google\.com\//i.test(normalized)) {
      showWarningToast(t("Paste a public Google Drive share link."));
      return;
    }
    setPreview("");
    setIsVideo(false);
    onChange?.({
      file: null,
      remoteUrl: normalized,
      previewUrl: "",
      resourceType: null,
    });
  };

  const clear = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview("");
    setRemoteUrl("");
    setIsVideo(false);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.({
      file: null,
      remoteUrl: "",
      previewUrl: "",
      resourceType: null,
    });
  };

  return (
    <div
      className={`media-source-picker${compact ? " media-source-picker-compact" : ""}`}
    >
      <div className="media-picker-heading">
        <div>
          <span className="media-picker-label">{t(label)}</span>
          <small>
            {t("Cloudinary stores and optimizes the uploaded file.")}
          </small>
        </div>
        {(preview || remoteUrl) && (
          <button
            type="button"
            className="media-clear-button"
            onClick={clear}
            aria-label={t("Clear selected media")}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {(preview || currentUrl) && (
        <div className="media-picker-preview">
          {isVideo ? (
            <video src={preview} controls />
          ) : (
            <img src={preview || currentUrl} alt={t("Selected preview")} />
          )}
        </div>
      )}

      <div
        className="media-picker-tabs"
        role="tablist"
        aria-label={t("{label} source", { label })}
      >
        <button
          type="button"
          className={mode === "device" ? "active" : ""}
          onClick={() => setMode("device")}
        >
          <Upload size={16} /> {t("Device")}
        </button>
        <button
          type="button"
          className={mode === "drive" ? "active" : ""}
          onClick={() => setMode("drive")}
        >
          <Cloud size={16} /> {t("Google Drive")}
        </button>
      </div>

      {mode === "device" ? (
        <>
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept={
              // "image/*" opens the Photos app on phones.
              allowVideo ? "image/*,video/*" : "image/*"
            }
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <button
            type="button"
            className="media-device-button"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus size={19} /> {t("Choose photo from device")}
          </button>
        </>
      ) : (
        <div className="media-drive-controls">
          <input
            type="url"
            value={remoteUrl}
            onChange={(event) => setRemoteUrl(event.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            aria-label={t("Public Google Drive share link")}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={applyDriveUrl}
          >
            {t("Use link")}
          </button>
          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noreferrer"
          >
            {t("Open Google Drive")}
          </a>
        </div>
      )}
    </div>
  );
}
