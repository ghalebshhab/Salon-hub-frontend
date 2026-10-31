import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scissors,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import useSalonDetails from "../hooks/useSalonDetails.js";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";
import ReviewsList from "../../reviews/components/ReviewsList.jsx";

const formatTime = (value) => value?.slice(0, 5) || "Not listed";

function SalonDetails() {
  const { salon, loading } = useSalonDetails();
  const { loggedIn } = useAuth();

  if (loading) {
    return (
      <section className="salon-details-page" aria-label="Loading salon profile">
        <div className="container salon-details-skeleton">
          <div className="skeleton-block salon-skeleton-hero" />
          <div className="skeleton-block salon-skeleton-copy" />
          <div className="skeleton-block salon-skeleton-section" />
        </div>
      </section>
    );
  }

  if (!salon) {
    return (
      <section className="container section">
        <div className="empty-state salon-not-found">
          <Scissors aria-hidden="true" />
          <h1>Salon not found</h1>
          <p>We could not find this salon. It may no longer be available.</p>
          <Link className="btn btn-primary" to="/">
            Browse salons
          </Link>
        </div>
      </section>
    );
  }

  const salonId = salon.salonId ?? salon.id;
  const image = salon.images?.[0];

  return (
    <section className="salon-details-page">
      <div className="container section">
        <div className="salon-details-hero">
          <div className="salon-details-media">
            {image ? (
              <img src={image} alt={`${salon.name} interior`} />
            ) : (
              <div className="salon-hero-placeholder">
                <Scissors aria-hidden="true" />
                <span aria-hidden="true">{salon.name?.[0] || "S"}</span>
              </div>
            )}
            <div className="salon-media-caption">
              <span>SalonHub spaces</span>
              <strong>{salon.city || "Local salon"}</strong>
            </div>
          </div>

          <div className="salon-details-hero-copy">
            <div className="salon-details-kicker">
              <span className="eyebrow">Salon profile</span>
              <SalonStatusBadge state={salon.state} />
            </div>
            <h1>{salon.name}</h1>
            <p className="salon-details-location">
              <MapPin aria-hidden="true" />
              {salon.city || "Location not listed"}
            </p>
            <p className="salon-details-description">
              {salon.description ||
                "A welcoming space for considered cuts, color, and care."}
            </p>
            <div className="salon-details-actions">
              <Link className="btn btn-primary" to={loggedIn ? `/salons/${salonId}/book` : "/login"}>
                <CalendarDays aria-hidden="true" />
                {loggedIn ? "Book appointment" : "Sign in to book"}
              </Link>
              {salon.phoneNumber && (
                <a className="btn btn-secondary" href={`tel:${salon.phoneNumber}`}>
                  <Phone aria-hidden="true" />
                  Call salon
                </a>
              )}
            </div>
            <div className="salon-details-hero-meta" aria-label="Salon hours and capacity">
              <div>
                <Clock3 aria-hidden="true" />
                <span>Hours</span>
                <strong>{formatTime(salon.openTime)} – {formatTime(salon.closeTime)}</strong>
              </div>
              <div>
                <UsersRound aria-hidden="true" />
                <span>Team capacity</span>
                <strong>{salon.currentNumOfEmployees ?? 0} / {salon.maxNumOfEmployees ?? "—"} members</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="salon-details-grid">
          <aside className="salon-details-aside">
            <div className="salon-info-card">
              <span className="eyebrow">At a glance</span>
              <h2>Plan your visit</h2>
              <div className="salon-info-list">
                <div><Clock3 aria-hidden="true" /><span><strong>Working hours</strong>{formatTime(salon.openTime)} – {formatTime(salon.closeTime)}</span></div>
                <div><MapPin aria-hidden="true" /><span><strong>Location</strong>{salon.city || "Not listed"}</span></div>
                <div><UsersRound aria-hidden="true" /><span><strong>Current team</strong>{salon.currentNumOfEmployees ?? 0} of {salon.maxNumOfEmployees ?? "—"}</span></div>
                {salon.phoneNumber && <div><Phone aria-hidden="true" /><span><strong>Phone</strong>{salon.phoneNumber}</span></div>}
                {salon.email && <div><Mail aria-hidden="true" /><span><strong>Email</strong>{salon.email}</span></div>}
              </div>
              <Link className="btn btn-primary full-width" to={loggedIn ? `/salons/${salonId}/book` : "/login"}>
                <CalendarDays aria-hidden="true" />
                {loggedIn ? "Book an appointment" : "Sign in to book"}
              </Link>
            </div>
          </aside>

          <main className="salon-details-content">
            <section className="salon-details-section" aria-labelledby="services-heading">
              <div className="salon-section-heading">
                <span className="eyebrow">The menu</span>
                <h2 id="services-heading">Services for your next visit</h2>
                <p>Explore the salon&apos;s available services, timing, and pricing before you book.</p>
              </div>
              <SalonServicesList salonId={salonId} />
            </section>

            <section className="salon-details-section salon-about-section" aria-labelledby="about-heading">
              <div className="salon-section-heading">
                <span className="eyebrow">The space</span>
                <h2 id="about-heading">About {salon.name}</h2>
                <p>{salon.description || "This salon has not added an introduction yet. Contact the salon directly to learn more about the space and services."}</p>
              </div>
              <div className="salon-about-contact">
                {salon.phoneNumber && <a href={`tel:${salon.phoneNumber}`}><Phone aria-hidden="true" />{salon.phoneNumber}</a>}
                {salon.email && <a href={`mailto:${salon.email}`}><Mail aria-hidden="true" />{salon.email}</a>}
              </div>
            </section>

            <section className="salon-details-section" aria-labelledby="reviews-heading">
              <div className="salon-section-heading">
                <span className="eyebrow">Client notes</span>
                <h2 id="reviews-heading">What guests are saying</h2>
                <p>Reviews from customers who have completed an appointment at this salon.</p>
              </div>
              <ReviewsList salonId={salonId} />
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}

export default SalonDetails;
