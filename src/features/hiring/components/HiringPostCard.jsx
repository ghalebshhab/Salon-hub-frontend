import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { isLoggedIn } from "../../../shared/auth/tokenStorage.js";
import { formatDateTime } from "../../../shared/utils/formatTime.js";
import t from "../../../shared/i18n/t.js";

function HiringPostCard({ post }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!isLoggedIn()) {
      showErrorToast(t("Please login first to apply to a salon."));
      return;
    }
    navigate(`/hiring-posts/${post.id}/apply`);
  };

  return (
    <article className="hiring-card">
      <div className="hiring-top">
        <div>
          <h3>{t(post.title)}</h3>
          <p className="muted">
            {post.salonName} • {t(post.salonCity)}
          </p>
        </div>
        <span className="badge badge-open">{post.status}</span>
      </div>

      <p className="hiring-description">{t(post.description)}</p>

      <div className="hiring-meta">
        <span>
          {t("Needed employees:")} <strong>{post.neededEmployees}</strong>
        </span>
        <span>{formatDateTime(post.createdAt)}</span>
      </div>

      <button className="btn btn-primary full-width" onClick={handleJoin}>
        {t("Join Salon")}
      </button>
    </article>
  );
}

export default HiringPostCard;
