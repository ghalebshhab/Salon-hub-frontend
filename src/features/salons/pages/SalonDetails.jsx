import {
  CalendarDays,
  Flag,
  PencilLine,
  Scissors,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSalonDetails from "../hooks/useSalonDetails.js";
import SalonClosureNotice from "../components/SalonClosureNotice.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";
import ReviewsList from "../../reviews/components/ReviewsList.jsx";
import useSalonRating from "../../reviews/hooks/useSalonRating.js";
import useAuth from "../../../shared/auth/useAuth.js";
import useNow from "../../../shared/hooks/useNow.js";
import useJoinSalonRequest from "../../employment/hooks/useJoinSalonRequest.js";
import SalonTeam from "../components/team/SalonTeam.jsx";
import SalonAbout from "../components/about/SalonAbout.jsx";
import SalonHero from "../components/hero/SalonHero.jsx";
import SalonSectionNav from "../components/SalonSectionNav.jsx";
import SalonBookingCard from "../components/SalonBookingCard.jsx";
import SalonWorkGallery from "../../media/components/SalonWorkGallery.jsx";
import useSalonFollow from "../../community/hooks/useSalonFollow.js";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";
import SalonLocationDialog from "../components/SalonLocationDialog.jsx";
import { toMapPoint } from "../model/jordanMapLocation.js";
import { hoursStatus } from "../model/salonAbout.js";

function PageSection({ id, eyebrow, title, intro, children }) {
  return (
    <section className="sp-section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="sp-heading">
        {eyebrow && <span className="sp-eyebrow">{eyebrow}</span>}
        <h2 id={`${id}-heading`}>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function SalonDetails() {
  const [reportOpen, setReportOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const { salonId: routeSalonId } = useParams();
  const { salon, employees, loading } = useSalonDetails();
  const { loggedIn, user } = useAuth();
  const { joining, requestJoin } = useJoinSalonRequest();
  const rating = useSalonRating(routeSalonId);
  const now = useNow();
  const visibleSalonId = salon?.salonId ?? salon?.id;
  const salonFollow = useSalonFollow(
    visibleSalonId,
    loggedIn && Boolean(salon),
  );

  if (loading) {
    return (
      <section className="sp" aria-label="Loading salon profile">
        <div className="container sp-skeleton">
          <div className="skeleton-block sp-skeleton-cover" />
          <div className="skeleton-block sp-skeleton-bar" />
          <div className="skeleton-block sp-skeleton-section" />
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
  const salonPath = `/salons/${salonId}`;
  const bookingPath = `/salons/${salonId}/book`;
  const ownsSalon = Number(user?.ownedSalonId) === Number(salonId);
  const belongsToSalon = Number(user?.salonId) === Number(salonId);
  const canRequestJoin =
    loggedIn && user?.role === "USER" && !ownsSalon && !belongsToSalon;
  const mapPoint = toMapPoint(salon.latitude, salon.longitude);
  const openMap = () => setMapOpen(true);
  const status = hoursStatus(salon, now);

  // Owners manage their salon; everyone else books (after sign-in).
  const primary = ownsSalon
    ? { to: "/owner/my-salon/edit", label: "Edit salon", icon: PencilLine }
    : loggedIn
      ? { to: bookingPath, label: "Book appointment", icon: CalendarDays }
      : {
          to: "/login",
          state: { from: bookingPath },
          label: "Sign in to book",
          icon: CalendarDays,
        };

  const moreActions = [
    canRequestJoin && {
      key: "join",
      label: joining ? "Sending request…" : "Request to join the team",
      icon: UserPlus,
      disabled: joining,
      onClick: () => requestJoin(salonId),
    },
    !loggedIn && {
      key: "sign-in-join",
      label: "Sign in to join the team",
      icon: UserPlus,
      to: "/login",
      state: { from: salonPath },
    },
    loggedIn &&
      !ownsSalon && {
        key: "report",
        label: "Report salon",
        icon: Flag,
        onClick: () => setReportOpen(true),
      },
  ].filter(Boolean);

  // Team cards, the gallery and the services menu open the booking wizard
  // with the chosen professional or services already picked.
  const bookingLink = (state) =>
    ownsSalon
      ? null
      : {
          signedIn: loggedIn,
          to: loggedIn ? bookingPath : "/login",
          state: (value) => (loggedIn ? state(value) : { from: bookingPath }),
        };
  const teamBooking = bookingLink((employeeId) => ({
    selectedEmployeeId: employeeId,
  }));
  const servicesBooking = bookingLink((serviceIds) => ({
    selectedServiceIds: serviceIds,
  }));

  return (
    <section className="sp">
      <div className="container sp-container">
        <SalonHero
          salon={salon}
          rating={rating}
          status={status}
          location={
            mapPoint
              ? { onOpenMap: openMap }
              : salon.googleMapsUrl
                ? { href: salon.googleMapsUrl }
                : null
          }
          primary={primary}
          follow={loggedIn && !ownsSalon ? salonFollow : null}
          moreActions={moreActions}
        >
          <SalonClosureNotice salonId={salonId} />
        </SalonHero>

        <SalonSectionNav />

        <div className="sp-grid">
          <main className="sp-main">
            <PageSection
              id="services"
              eyebrow="The menu"
              title="Services and prices"
              intro="Prices and times as the salon lists them. Pick what you need for one visit and book it in one step."
            >
              <SalonServicesList salonId={salonId} booking={servicesBooking} />
            </PageSection>

            <PageSection
              id="team"
              eyebrow="Meet the team"
              title={`The people behind ${salon.name}`}
              intro="See what each professional does best and book with the one you like, or let the salon choose for you."
            >
              <SalonTeam employees={employees} booking={teamBooking} />
            </PageSection>

            <PageSection
              id="work"
              eyebrow="Portfolio"
              title="Recent work"
              intro="Photos and videos from the professionals who work here."
            >
              <SalonWorkGallery salonId={salonId} booking={teamBooking} />
            </PageSection>

            <PageSection
              id="reviews"
              eyebrow="Guest reviews"
              title="What guests are saying"
              intro="Every review comes from a guest who finished a visit at this salon."
            >
              <ReviewsList salonId={salonId} />
            </PageSection>

            <PageSection id="about" title="About">
              <SalonAbout salon={salon} onOpenMap={mapPoint ? openMap : null} />
            </PageSection>
          </main>

          <aside className="sp-aside" aria-label="Plan your visit">
            <SalonBookingCard
              salon={salon}
              status={status}
              now={now}
              primary={primary}
              mapPoint={mapPoint}
              onOpenMap={openMap}
            />
          </aside>
        </div>
      </div>

      {mapOpen && mapPoint && (
        <SalonLocationDialog
          salonName={salon.name}
          city={salon.city}
          point={mapPoint}
          onClose={() => setMapOpen(false)}
        />
      )}
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
