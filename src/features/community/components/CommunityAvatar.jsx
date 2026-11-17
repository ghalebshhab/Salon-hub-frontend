import { Store } from "lucide-react";
import { getInitials } from "../model/communityPresentation.js";

export default function CommunityAvatar({
  name,
  salon = false,
  size = "",
  imageUrl,
}) {
  const className = [
    "community-avatar",
    salon ? "is-salon" : "",
    imageUrl ? "has-image" : "",
    size,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} aria-hidden="true">
      {imageUrl ? (
        <img src={imageUrl} alt="" loading="lazy" />
      ) : salon ? (
        <Store size={size === "small" ? 15 : 19} />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
