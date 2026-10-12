import { Clock, Mail, MapPin, Phone, Scissors, UsersRound } from "lucide-react";
import useSalonDetails from "../hooks/useSalonDetails.js";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";

function SalonDetails() {
  const { salon, loading } = useSalonDetails();
  if (loading) return <div className="loading">Loading salon profile...</div>;
  if (!salon)
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
        </div>
      </section>
    );
  const image = salon.images?.[0];
  return (
    <section className="salon-profile-page">
      <div className="container section">
        <div className="salon-profile-hero">
          <div className="salon-hero-image">
            {image ? (
              <img src={image} alt={salon.name} />
            ) : (
              <div className="salon-hero-placeholder">
                <Scissors size={44} />
                <span>{salon.name?.[0]}</span>
              </div>
            )}
          </div>
          <div className="salon-hero-content">
            <div className="salon-hero-title-row">
              <div>
                <span className="eyebrow">Salon profile</span>
                <h1>{salon.name}</h1>
                <p>
                  <MapPin size={17} />
                  {salon.city}
                </p>
              </div>
              <SalonStatusBadge state={salon.state} />
            </div>
            <div className="salon-hero-actions">
              <a className="btn btn-primary" href={`tel:${salon.phoneNumber}`}>
                <Phone size={18} />
                Call Salon
              </a>
            </div>
            <div className="salon-profile-stats">
              <div className="salon-stat-card">
                <Clock size={22} />
                <strong>
                  {salon.openTime?.slice(0, 5)} - {salon.closeTime?.slice(0, 5)}
                </strong>
                <span>Working hours</span>
              </div>
              <div className="salon-stat-card">
                <UsersRound size={22} />
                <strong>
                  {salon.currentNumOfEmployees ?? 0}/
                  {salon.maxNumOfEmployees ?? "—"}
                </strong>
                <span>Employees</span>
              </div>
            </div>
          </div>
        </div>
        <div className="salon-profile-layout">
          <aside className="salon-profile-sidebar">
            <div className="salon-side-card">
              <h3>Contact</h3>
              <p>
                <Phone size={16} />
                {salon.phoneNumber}
              </p>
              <p>
                <Mail size={16} />
                {salon.email}
              </p>
              <p>
                <MapPin size={16} />
                {salon.city}
              </p>
            </div>
          </aside>
          <main className="salon-profile-content">
            <section className="salon-content-section">
              <div className="salon-section-heading">
                <span className="eyebrow">About</span>
                <h2>{salon.name}</h2>
                <p>{salon.description || "No description provided."}</p>
              </div>
            </section>
            <section className="salon-content-section">
              <div className="salon-section-heading">
                <span className="eyebrow">Menu</span>
                <h2>Services and booking</h2>
                <p>
                  Choose a service to see its price and request an appointment.
                </p>
              </div>
              <SalonServicesList salonId={salon.salonId ?? salon.id} />
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}
export default SalonDetails;
