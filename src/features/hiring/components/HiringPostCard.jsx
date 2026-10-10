import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { isLoggedIn } from "../../../shared/auth/tokenStorage.js";
import { formatDateTime } from "../../../shared/utils/formatTime.js";

function HiringPostCard({ post }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!isLoggedIn()) {
      showErrorToast("Please login first to apply to a salon.");
      return;
    }
    navigate(`/hiring-posts/${post.id}/apply`);
  };

  return (
    <article className="hiring-card">
      <div className="hiring-top">
        <div>
          <h3>{post.title}</h3>
          <p className="muted">
            {post.salonName} • {post.salonCity}
          </p>
        </div>
        <span className="badge badge-open">{post.status}</span>
      </div>

      <p className="hiring-description">{post.description}</p>

      <div className="hiring-meta">
        <span>
          Needed employees: <strong>{post.neededEmployees}</strong>
        </span>
        <span>{formatDateTime(post.createdAt)}</span>
      </div>

      <button className="btn btn-primary full-width" onClick={handleJoin}>
        Join Salon
      </button>
    </article>
  );
}

export default HiringPostCard;
