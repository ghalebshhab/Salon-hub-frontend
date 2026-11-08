import { Store } from "lucide-react";
import { getInitials } from "../model/communityPresentation.js";

export default function CommunityAvatar({ name, salon = false, size = "" }) {
  const className = ["community-avatar", salon ? "is-salon" : "", size]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} aria-hidden="true">
      {salon ? <Store size={size === "small" ? 15 : 19} /> : getInitials(name)}
    </span>
  );
}
