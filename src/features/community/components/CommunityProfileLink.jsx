import { Link } from "react-router-dom";
import CommunityAvatar from "./CommunityAvatar.jsx";

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
      aria-label={`View ${user.displayName || user.userName}'s profile`}
      onClick={onClick}
    >
      {showAvatar && (
        <CommunityAvatar
          name={user.displayName || user.userName}
          salon={salon}
          size={size}
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
