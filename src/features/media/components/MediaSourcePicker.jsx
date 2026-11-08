import { Cloud, ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { showWarningToast } from "../../../shared/notifications/toast.jsx";

const IMAGE_LIMIT = 8 * 1024 * 1024;
const VIDEO_LIMIT = 40 * 1024 * 1024;

export default function MediaSourcePicker({
  label = "Media",
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
        allowVideo ? "Choose an image or video." : "Choose an image file.",
      );
      return;
    }
    if (file.size > (video ? VIDEO_LIMIT : IMAGE_LIMIT)) {
      showWarningToast(
        video
          ? "Videos must be 40 MB or smaller."
          : "Images must be 8 MB or smaller.",
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
      showWarningToast("Paste a public Google Drive share link.");
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
          <span className="media-picker-label">{label}</span>
          <small>Cloudinary stores and optimizes the uploaded file.</small>
        </div>
        {(preview || remoteUrl) && (
          <button
            type="button"
            className="media-clear-button"
            onClick={clear}
            aria-label="Clear selected media"
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
            <img src={preview || currentUrl} alt="Selected preview" />
          )}
        </div>
      )}

      <div
        className="media-picker-tabs"
        role="tablist"
        aria-label={`${label} source`}
      >
        <button
          type="button"
          className={mode === "device" ? "active" : ""}
          onClick={() => setMode("device")}
        >
          <Upload size={16} /> Device
        </button>
        <button
          type="button"
          className={mode === "drive" ? "active" : ""}
          onClick={() => setMode("drive")}
        >
          <Cloud size={16} /> Google Drive
        </button>
      </div>

      {mode === "device" ? (
        <>
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept={
              allowVideo
                ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                : "image/jpeg,image/png,image/webp,image/gif"
            }
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <button
            type="button"
            className="media-device-button"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus size={19} /> Choose from device
          </button>
        </>
      ) : (
        <div className="media-drive-controls">
          <input
            type="url"
            value={remoteUrl}
            onChange={(event) => setRemoteUrl(event.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            aria-label="Public Google Drive share link"
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={applyDriveUrl}
          >
            Use link
          </button>
          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noreferrer"
          >
            Open Google Drive
          </a>
        </div>
      )}
    </div>
  );
}
