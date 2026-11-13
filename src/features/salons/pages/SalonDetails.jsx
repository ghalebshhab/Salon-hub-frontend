import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Scissors,
  UserPlus,
  UsersRound,
  Heart,
  Flag,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SalonCoverPlaceholder from "../components/SalonCoverPlaceholder.jsx";
import useSalonDetails from "../hooks/useSalonDetails.js";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";
import ReviewsList from "../../reviews/components/ReviewsList.jsx";
import useAuth from "../../../shared/auth/useAuth.js";
import useJoinSalonRequest from "../../employment/hooks/useJoinSalonRequest.js";
import SalonEmployees from "../components/SalonEmployees.jsx";
import SalonWorkGallery from "../../media/components/SalonWorkGallery.jsx";
import { optimizedCloudinaryImage } from "../../media/model/cloudinaryMedia.js";
import useSalonFollow from "../../community/hooks/useSalonFollow.js";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";

const formatTime = (value) => value?.slice(0, 5) || "Not listed";

function SalonDetails() {
  const [reportOpen, setReportOpen] = useState(false);
  const { salon, employees, loading } = useSalonDetails();
  const { loggedIn, user } = useAuth();
  const { joining, requestJoin } = useJoinSalonRequest();
  const visibleSalonId = salon?.salonId ?? salon?.id;
  const salonFollow = useSalonFollow(
    visibleSalonId,
    loggedIn && Boolean(salon),
  );

  if (loading) {
    return (
      <section
        className="salon-details-page"
        aria-label="Loading salon profile"
      >
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
  const salonPath = `/salons/${salonId}`;
  const bookingPath = `/salons/${salonId}/book`;
  const ownsSalon = Number(user?.ownedSalonId) === Number(salonId);
  const belongsToSalon = Number(user?.salonId) === Number(salonId);
  const canRequestJoin =
    loggedIn && user?.role === "USER" && !ownsSalon && !belongsToSalon;
  return (
    <section className="salon-details-page">
      <div className="container section">
        <div className="salon-details-hero">
          <div className="salon-details-media">
            {image ? (
              <img
                src={optimizedCloudinaryImage(image, {
                  width: 1400,
                  height: 1000,
                })}
                alt={`${salon.name} interior`}
              />
            ) : (
              <SalonCoverPlaceholder name={salon.name} variant="hero" />
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
            {salon.googleMapsUrl ? (
              <a
                className="salon-details-location salon-details-location-link"
                href={salon.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin aria-hidden="true" />
                <span>{salon.city || "View salon location"}</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <p className="salon-details-location">
                <MapPin aria-hidden="true" />
                <span>{salon.city || "Location not listed"}</span>
              </p>
            )}
            <p className="salon-details-description">
              {salon.description ||
                "This salon has not added a description yet."}
            </p>

            <div className="salon-details-actions">
              <Link
                className="btn btn-primary"
                to={loggedIn ? bookingPath : "/login"}
                state={loggedIn ? undefined : { from: bookingPath }}
              >
                <CalendarDays aria-hidden="true" />
                {loggedIn ? "Book appointment" : "Sign in to book"}
              </Link>
              {salon.phoneNumber && (
                <a
                  className="btn btn-secondary"
                  href={`tel:${salon.phoneNumber}`}
                >
                  <Phone aria-hidden="true" />
                  Call salon
                </a>
              )}
              {loggedIn && !ownsSalon && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={salonFollow.busy}
                  onClick={salonFollow.toggle}
                >
                  <Heart
                    aria-hidden="true"
                    fill={salonFollow.followed ? "currentColor" : "none"}
                  />
                  {salonFollow.followed ? "Following salon" : "Follow salon"}
                </button>
              )}
              {canRequestJoin && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={joining}
                  onClick={() => requestJoin(salonId)}
                >
                  <UserPlus aria-hidden="true" />
                  {joining ? "Sending request…" : "Request to join team"}
                </button>
              )}
              {loggedIn && !ownsSalon && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setReportOpen(true)}
                >
                  <Flag aria-hidden="true" /> Report salon
                </button>
              )}
              {!loggedIn && (
                <Link
                  className="btn btn-secondary"
                  to="/login"
                  state={{ from: salonPath }}
                >
                  <UserPlus aria-hidden="true" />
                  Sign in to join
                </Link>
              )}
            </div>

            <div
              className="salon-details-hero-meta"
              aria-label="Salon hours and capacity"
            >
              <div>
                <Clock3 aria-hidden="true" />
                <span>Hours</span>
                <strong>
                  {formatTime(salon.openTime)} – {formatTime(salon.closeTime)}
                </strong>
              </div>
              <div>
                <UsersRound aria-hidden="true" />
                <span>Team capacity</span>
                <strong>
                  {salon.currentNumOfEmployees ?? 0} /{" "}
                  {salon.maxNumOfEmployees ?? "—"} members
                </strong>
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
                <div>
                  <Clock3 aria-hidden="true" />
                  <span>
                    <strong>Working hours</strong>
                    {formatTime(salon.openTime)} – {formatTime(salon.closeTime)}
                  </span>
                </div>
                <div>
                  <MapPin aria-hidden="true" />
                  <span>
                    <strong>Location</strong>
                    {salon.googleMapsUrl ? (
                      <a
                        href={salon.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {salon.city || "Open in Google Maps"}{" "}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      salon.city || "Not listed"
                    )}
                  </span>
                </div>
                <div>
                  <UsersRound aria-hidden="true" />
                  <span>
                    <strong>Current team</strong>
                    {salon.currentNumOfEmployees ?? 0} of{" "}
                    {salon.maxNumOfEmployees ?? "—"}
                  </span>
                </div>
                {salon.phoneNumber && (
                  <div>
                    <Phone aria-hidden="true" />
                    <span>
                      <strong>Phone</strong>
                      {salon.phoneNumber}
                    </span>
                  </div>
                )}
                {salon.email && (
                  <div>
                    <Mail aria-hidden="true" />
                    <span>
                      <strong>Email</strong>
                      {salon.email}
                    </span>
                  </div>
                )}
              </div>
              <Link
                className="btn btn-primary full-width"
                to={loggedIn ? bookingPath : "/login"}
                state={loggedIn ? undefined : { from: bookingPath }}
              >
                <CalendarDays aria-hidden="true" />
                {loggedIn ? "Book an appointment" : "Sign in to book"}
              </Link>
            </div>
          </aside>

          <main className="salon-details-content">
            <section
              className="salon-details-section"
              aria-labelledby="services-heading"
            >
              <div className="salon-section-heading">
                <span className="eyebrow">The menu</span>
                <h2 id="services-heading">Services for your next visit</h2>
                <p>
                  Explore the salon&apos;s available services, timing, and
                  pricing before you book.
                </p>
              </div>
              <SalonServicesList salonId={salonId} />
            </section>

            <section
              className="salon-details-section salon-about-section"
              aria-labelledby="about-heading"
            >
              <div className="salon-section-heading">
                <span className="eyebrow">The space</span>
                <h2 id="about-heading">About {salon.name}</h2>
                <p>
                  {salon.description ||
                    "This salon has not added an introduction yet. Contact the salon directly to learn more."}
                </p>
              </div>
              <div className="salon-about-contact">
                {salon.phoneNumber && (
                  <a href={`tel:${salon.phoneNumber}`}>
                    <Phone aria-hidden="true" />
                    {salon.phoneNumber}
                  </a>
                )}
                {salon.email && (
                  <a href={`mailto:${salon.email}`}>
                    <Mail aria-hidden="true" />
                    {salon.email}
                  </a>
                )}
              </div>
            </section>

            <section
              className="salon-details-section"
              aria-labelledby="team-heading"
            >
              <div className="salon-section-heading">
                <span className="eyebrow">Meet the professionals</span>
                <h2 id="team-heading">The people behind {salon.name}</h2>
                <p>
                  Explore the team&apos;s specialties, experience, skills, and
                  services without exposing their private contact information.
                </p>
              </div>
              <SalonEmployees employees={employees} />
            </section>

            <section
              className="salon-details-section"
              aria-labelledby="work-heading"
            >
              <div className="salon-section-heading">
                <span className="eyebrow">Team portfolio</span>
                <h2 id="work-heading">Recent work from the salon</h2>
                <p>
                  Photos and videos published by active employees who work at
                  this salon.
                </p>
              </div>
              <SalonWorkGallery salonId={salonId} />
            </section>

            <section
              className="salon-details-section"
              aria-labelledby="reviews-heading"
            >
              <div className="salon-section-heading">
                <span className="eyebrow">Client notes</span>
                <h2 id="reviews-heading">What guests are saying</h2>
                <p>
                  Reviews from customers who completed an appointment at this
                  salon.
                </p>
              </div>
              <ReviewsList salonId={salonId} />
            </section>
          </main>
        </div>
      </div>
      {reportOpen && (
        <ReportDialog
          targetType="SALON"
          targetId={salonId}
          targetLabel={salon.name}
          onClose={() => setReportOpen(false)}
        />
      )}
    </section>
  );
}
export default SalonDetails;
