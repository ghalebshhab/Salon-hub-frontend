import { Link } from "react-router-dom";
import {
  Building2,
  Image,
  UserPlus,
  BriefcaseBusiness,
  Eye,
  CalendarCheck,
  Scissors,
} from "lucide-react";
import { UsersRound } from "lucide-react";
function OwnerDashboard() {
  return (
    <section className="container section">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Owner area</span>
          <h1>Dashboard</h1>
          <p>
            Manage your salon profile, services, bookings, media, and hiring
            posts.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/owner/create-salon">
          <Building2 />
          <h3>Create Salon</h3>
          <p>Create your salon profile using your owner token.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/my-salon">
          <Eye />
          <h3>My Salon</h3>
          <p>View and manage your salon profile and team.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/services">
          <Scissors />
          <h3>My Services</h3>
          <p>Add, edit, and disable services customers can book.</p>
        </Link>

        <Link
          className="dashboard-card important-dashboard-card"
          to="/owner/bookings"
        >
          <CalendarCheck />
          <h3>Salon Bookings</h3>
          <p>Accept, reject, or complete customer appointment requests.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/create-media-post">
          <Image />
          <h3>Post Media</h3>
          <p>Post images and videos of your salon work.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/create-hiring-post">
          <UserPlus />
          <h3>Create Hiring Post</h3>
          <p>Let barbers join your salon when you need employees.</p>
        </Link>

        <Link className="dashboard-card" to="/hiring-posts">
          <BriefcaseBusiness />
          <h3>View Hiring Posts</h3>
          <p>See all open hiring posts on the platform.</p>
        </Link>
        <Link className="dashboard-card" to="/owner/employees">
          <UsersRound />
          <h3>Employees</h3>
          <p>View invited and active employees in your salon.</p>
        </Link>
      </div>
    </section>
  );
}

export default OwnerDashboard;
