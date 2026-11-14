import { Heart, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import { isWorkspaceRoute } from "./footerRoutes.js";

function footerColumns({ loggedIn, isOwner }) {
  return [
    {
      title: "Discover",
      links: [
        { to: "/", label: "Find a salon" },
        { to: "/community", label: "Community" },
        { to: "/hiring-posts", label: "Career opportunities" },
      ],
    },
    {
      title: "For professionals",
      links: loggedIn
        ? [
            { to: "/profile/career", label: "Career profile" },
            { to: "/my-applications", label: "My applications" },
            { to: "/employment", label: "Employment center" },
          ]
        : [
            { to: "/register", label: "Create your profile" },
            { to: "/hiring-posts", label: "Browse openings" },
          ],
    },
    {
      title: "For salons",
      links: isOwner
        ? [
            { to: "/owner/dashboard", label: "Salon dashboard" },
            { to: "/owner/bookings", label: "Booking requests" },
            { to: "/owner/create-hiring-post", label: "Post a job" },
          ]
        : [
            {
              to: loggedIn ? "/owner/create-salon" : "/register",
              label: "List your salon",
            },
            { to: "/hiring-posts", label: "Hire talent" },
          ],
    },
  ];
}

function FooterMeta() {
  return (
    <>
      <span>© {new Date().getFullYear()} SalonHub</span>
      <span className="footer-location">
        <MapPin size={14} aria-hidden="true" /> Built for Jordan
      </span>
    </>
  );
}

function Footer() {
  const { loggedIn, isOwner } = useAuth();
  const { pathname } = useLocation();

  // Work screens get a quiet one-line footer; public pages get the full one.
  if (isWorkspaceRoute(pathname)) {
    return (
      <footer className="footer footer-slim">
        <div className="container footer-slim-inner">
          <FooterMeta />
          <nav className="footer-slim-links" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/community">Community</Link>
            <Link to="/hiring-posts">Careers</Link>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-accent" aria-hidden="true" />
      <div className="container footer-inner">
        <div className="footer-intro">
          <Link to="/" className="footer-brand" aria-label="SalonHub home">
            <BrandLogo />
          </Link>
          <h2>Everything your salon journey needs, in one place.</h2>
          <p>
            Discover trusted salons, manage bookings, and grow professional
            teams across Jordan.
          </p>
        </div>

        <nav className="footer-columns" aria-label="Footer navigation">
          {footerColumns({ loggedIn, isOwner }).map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container footer-bottom">
        <FooterMeta />
        <span className="footer-care">
          Made for better salon experiences{" "}
          <Heart size={13} aria-hidden="true" />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
