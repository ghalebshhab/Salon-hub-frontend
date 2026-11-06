import { ArrowUpRight, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";

function Footer() {
  const { loggedIn, isOwner } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-accent" aria-hidden="true" />
      <div className="container footer-inner">
        <div className="footer-intro">
          <span className="footer-kicker">Beauty, careers, and community</span>
          <h2>Everything your salon journey needs, in one place.</h2>
          <p>
            Discover trusted salons, manage bookings, and grow professional
            teams across Jordan.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">
            Explore SalonHub <ArrowUpRight size={15} />
          </Link>
          <Link to="/hiring-posts">
            Career opportunities <ArrowUpRight size={15} />
          </Link>
          {loggedIn && (
            <Link to="/my-bookings">
              My bookings <ArrowUpRight size={15} />
            </Link>
          )}
          {isOwner && (
            <Link to="/owner/dashboard">
              Owner workspace <ArrowUpRight size={15} />
            </Link>
          )}
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SalonHub</span>
        <span className="footer-location">
          <MapPin size={14} /> Built for Jordan
        </span>
        <span className="footer-care">
          Made for better salon experiences <Heart size={13} />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
