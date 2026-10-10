import {
  BriefcaseBusiness,
  Building2,
  Eye,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

function OwnerDashboard() {
  return (
    <section className="container section">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Owner area</span>
          <h1>Dashboard</h1>
          <p>Manage your salon profile and hiring workflow.</p>
        </div>
      </div>
      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/owner/create-salon">
          <Building2 />
          <h3>Create Salon</h3>
          <p>Submit your salon profile for review.</p>
        </Link>
        <Link className="dashboard-card" to="/owner/my-salon">
          <Eye />
          <h3>My Salon</h3>
          <p>View and manage your salon profile.</p>
        </Link>
        <Link className="dashboard-card" to="/owner/create-hiring-post">
          <UserPlus />
          <h3>Create Hiring Post</h3>
          <p>Publish an opening for your salon.</p>
        </Link>
        <Link className="dashboard-card" to="/owner/applications">
          <UsersRound />
          <h3>Hiring Applications</h3>
          <p>Review candidates for your open positions.</p>
        </Link>
        <Link className="dashboard-card" to="/hiring-posts">
          <BriefcaseBusiness />
          <h3>View Hiring Posts</h3>
          <p>Browse current openings on the platform.</p>
        </Link>
      </div>
    </section>
  );
}
export default OwnerDashboard;
