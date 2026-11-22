import { Link } from "react-router-dom";
import CommunityAvatar from "./CommunityAvatar.jsx";
import t from "../../../shared/i18n/t.js";

export default function CommunityProfileLink({
  user,
  size = "",
  salon = false,
  showAvatar = true,
  className = "",
  children,
  onClick,
}) {
  if (!user?.id) return null;

  return (
    <Link
      className={["community-profile-link", className]
        .filter(Boolean)
        .join(" ")}
      to={`/community/people/${user.id}`}
      aria-label={t("View {value}'s profile", {
        value: user.displayName || user.userName,
      })}
      onClick={onClick}
    >
      {showAvatar && (
        <CommunityAvatar
          name={user.displayName || user.userName}
          salon={salon}
          size={size}
          imageUrl={salon ? undefined : user.profilePictureUrl}
        />
      )}
      {children || (
        <span className="community-profile-link-copy">
          <strong>{user.displayName || user.userName}</strong>
          <small>@{user.userName}</small>
        </span>
      )}
    </Link>
  );
}
