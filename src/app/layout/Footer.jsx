import { Heart, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import BrandLogo from "../../shared/components/BrandLogo.jsx";
import { isWorkspaceRoute } from "./footerRoutes.js";
import useI18n from "../../shared/i18n/useI18n.js";
import t from "../../shared/i18n/t.js";

function footerColumns({ loggedIn, isOwner }) {
  return [
    {
      title: t("Discover"),
      links: [
        { to: "/", label: t("Find a salon") },
        { to: "/community", label: t("Community") },
        { to: "/hiring-posts", label: t("Career opportunities") },
      ],
    },
    {
      title: t("For professionals"),
      links: loggedIn
        ? [
            { to: "/profile/career", label: t("Career profile") },
            { to: "/my-applications", label: t("My applications") },
            { to: "/employment", label: t("Employment center") },
          ]
        : [
            { to: "/register", label: t("Create your profile") },
            { to: "/hiring-posts", label: t("Browse openings") },
          ],
    },
    {
      title: t("For salons"),
      links: isOwner
        ? [
            { to: "/owner/dashboard", label: t("Salon dashboard") },
            { to: "/owner/bookings", label: t("Booking requests") },
            { to: "/owner/create-hiring-post", label: t("Post a job") },
          ]
        : [
            {
              to: loggedIn ? "/owner/create-salon" : "/register",
              label: t("List your salon"),
            },
            { to: "/hiring-posts", label: t("Hire talent") },
          ],
    },
  ];
}

function FooterMeta() {
  const { t } = useI18n();
  return (
    <>
      <span>
        © {new Date().getFullYear()} {t("SalonHub")}
      </span>
      <span className="footer-location">
        <MapPin size={14} aria-hidden="true" /> {t("Built for Jordan")}
      </span>
    </>
  );
}

function Footer() {
  const { loggedIn, isOwner } = useAuth();
  const { pathname } = useLocation();
  const { t } = useI18n();

  // Work screens get a quiet one-line footer; public pages get the full one.
  if (isWorkspaceRoute(pathname)) {
    return (
      <footer className="footer footer-slim">
        <div className="container footer-slim-inner">
          <FooterMeta />
          <nav
            className="footer-slim-links"
            aria-label={t("Footer navigation")}
          >
            <Link to="/">{t("Home")}</Link>
            <Link to="/community">{t("Community")}</Link>
            <Link to="/hiring-posts">{t("Careers")}</Link>
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
          <Link to="/" className="footer-brand" aria-label={t("SalonHub home")}>
            <BrandLogo />
          </Link>
          <h2>{t("Everything your salon journey needs, in one place.")}</h2>
          <p>
            {t(
              "Discover trusted salons, manage bookings, and grow professional teams across Jordan.",
            )}
          </p>
        </div>

        <nav className="footer-columns" aria-label={t("Footer navigation")}>
          {footerColumns({ loggedIn, isOwner }).map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{t(column.title)}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link to={link.to}>{t(link.label)}</Link>
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
          {t("Made for better salon experiences")}{" "}
          <Heart size={13} aria-hidden="true" />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
