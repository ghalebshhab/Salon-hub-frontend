import {
  ChevronDown,
  Globe2,
  Link2,
  LoaderCircle,
  Send,
  Store,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import PhotoPickerButton from "../../../shared/components/PhotoPickerButton.jsx";
import { isVideoMedia } from "../model/communityPresentation.js";
import CommunityAvatar from "./CommunityAvatar.jsx";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";

export default function CommunityComposer({ user, busy, onPublish }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [publishAsSalon, setPublishAsSalon] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const displayName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
  const publishing = isCommunityActionBusy(busy, "create-post");

  useEffect(
    () => () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    },
    [filePreview],
  );

  // Keep the picked file on the device until the post is published.
  const pickPhoto = (file) => {
    setMediaFile(file);
    setFilePreview(URL.createObjectURL(file));
    setMediaUrl("");
  };

  const linkUrl = /^https?:\/\//i.test(mediaUrl.trim()) ? mediaUrl.trim() : "";
  const previewUrl = filePreview || linkUrl;
  const previewIsVideo = mediaFile
    ? mediaFile.type.startsWith("video/")
    : isVideoMedia(linkUrl);

  const clearMedia = () => {
    setMediaFile(null);
    setFilePreview("");
    setMediaUrl("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setPublishError(false);
    try {
      const created = await onPublish({
        content,
        mediaUrl: mediaUrl.trim() || null,
        mediaFile,
        salonId: publishAsSalon ? user?.ownedSalonId : null,
      });
      if (created) {
        setContent("");
        clearMedia();
      } else {
        setPublishError(true);
      }
    } catch {
      setPublishError(true);
    }
  };

  return (
    <form
      className="community-composer"
      id="community-composer"
      onSubmit={submit}
    >
      <header className="community-composer-heading">
        <div>
          <strong>Start a conversation</strong>
          <span className="community-composer-audience">
            {publishAsSalon ? (
              <Store size={13} aria-hidden="true" />
            ) : (
              <Globe2 size={13} aria-hidden="true" />
            )}
            {publishAsSalon ? "Posting as your salon" : "SalonHub community"}
            <ChevronDown size={13} aria-hidden="true" />
          </span>
        </div>
        <span aria-live="polite">{content.length} / 5000</span>
      </header>
      <div className="community-composer-top">
        <CommunityAvatar
          name={displayName || user?.userName || "SalonHub member"}
          imageUrl={user?.profilePictureUrl}
        />
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (publishError) setPublishError(false);
          }}
          maxLength={5000}
          placeholder={`What would you like to share${user?.firstName ? `, ${user.firstName}` : ""}?`}
          aria-label="Post content"
          aria-describedby={
            publishError ? "community-publish-error" : undefined
          }
        />
      </div>
      <div
        className="community-media-input"
        id="community-media-input"
        hidden={!mediaOpen}
      >
        <Link2 size={18} aria-hidden="true" />
        <input
          type="url"
          value={mediaUrl}
          onChange={(event) => {
            if (mediaFile) clearMedia();
            setMediaUrl(event.target.value);
          }}
          placeholder="Paste an image or video URL"
          aria-label="Media URL"
        />
      </div>
      {previewUrl && (
        <div className="community-media-preview">
          {previewIsVideo ? (
            <video src={previewUrl} controls preload="metadata" />
          ) : (
            <img src={previewUrl} alt="Selected media preview" />
          )}
          <button type="button" onClick={clearMedia} aria-label="Remove media">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      {publishError && (
        <p
          className="community-composer-error"
          id="community-publish-error"
          role="alert"
        >
          Your post couldn&apos;t be published. Please try again.
        </p>
      )}
      <footer>
        <div className="community-composer-tools">
          <button
            className={mediaOpen ? "is-active" : ""}
            type="button"
            aria-expanded={mediaOpen}
            aria-controls="community-media-input"
            onClick={() => setMediaOpen((open) => !open)}
          >
            <Link2 size={18} aria-hidden="true" /> Media URL
          </button>
          <PhotoPickerButton
            label="Photo"
            allowVideo
            busy={publishing}
            busyLabel="Photo"
            className={mediaFile ? "is-active" : ""}
            onSelect={pickPhoto}
          />
          {user?.ownedSalonId && (
            <label className={publishAsSalon ? "is-active" : ""}>
              <input
                type="checkbox"
                checked={publishAsSalon}
                onChange={(event) => setPublishAsSalon(event.target.checked)}
              />
              <Store size={17} aria-hidden="true" /> Post as salon
            </label>
          )}
        </div>
        <button
          className="btn btn-primary community-publish-button"
          type="submit"
          disabled={!content.trim() || publishing}
        >
          {publishing ? (
            <>
              <LoaderCircle
                size={16}
                className="community-spinning"
                aria-hidden="true"
              />{" "}
              Publishing…
            </>
          ) : (
            <>
              <Send size={16} aria-hidden="true" /> Publish post
            </>
          )}
        </button>
      </footer>
    </form>
  );
}
