import {
  BriefcaseBusiness,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import useMySalon from "../hooks/useMySalon.js";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";

function MySalon() {
  const {
    salon,
    loading,
    error,
    deleteSalonModalOpen,
    setDeleteSalonModalOpen,
    deletingSalon,
    handleDeleteSalon,
  } = useMySalon();
  if (loading) return <Loading />;
  if (error || !salon)
    return (
      <section className="container section">
        <EmptyState
          title="No salon found"
          message={error || "Create a salon to get started."}
        />
        <Link className="btn btn-primary" to="/owner/create-salon">
          <Plus size={18} />
          Create My Salon
        </Link>
      </section>
    );
  const image = salon.images?.[0];
  return (
    <section className="my-salon-page">
      <div className="container section">
        <div className="my-salon-hero">
          <div className="my-salon-cover">
            {image ? (
              <img src={image} alt={salon.name} />
            ) : (
              <div className="my-salon-cover-placeholder">
                {salon.name?.[0]}
              </div>
            )}
            <div className="my-salon-floating-status">
              <SalonStatusBadge state={salon.state} />
            </div>
          </div>
          <div className="my-salon-hero-content">
            <h1>{salon.name}</h1>
            <p>
              <MapPin size={17} />
              {salon.city}
            </p>
            <div className="my-salon-hero-actions">
              <Link className="btn btn-primary" to={`/salons/${salon.salonId}`}>
                <Eye size={18} />
                Public View
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => setDeleteSalonModalOpen(true)}
              >
                <Trash2 size={18} />
                Delete Salon
              </button>
            </div>
          </div>
        </div>
        <div className="my-salon-actions-grid">
          <Link className="my-salon-action-card" to="/owner/create-hiring-post">
            <BriefcaseBusiness />
            <h3>Create Hiring Post</h3>
            <p>Publish an opening for your salon.</p>
          </Link>
          <Link className="my-salon-action-card" to="/owner/applications">
            <UsersRound />
            <h3>Hiring Applications</h3>
            <p>Review candidates who applied.</p>
          </Link>
        </div>
        <div className="my-salon-dashboard-layout">
          <aside className="my-salon-sidebar">
            <div className="my-salon-side-card">
              <h3>Contact Details</h3>
              <p>
                <Phone size={16} />
                {salon.phoneNumber || "—"}
              </p>
              <p>
                <Mail size={16} />
                {salon.email || "—"}
              </p>
              <p>
                <MapPin size={16} />
                {salon.city || "—"}
              </p>
            </div>
            <div className="my-salon-side-card">
              <h3>Capacity</h3>
              <p>
                <UsersRound size={16} />
                {salon.currentNumOfEmployees ?? 0} /{" "}
                {salon.maxNumOfEmployees ?? "—"} employees
              </p>
              <p>
                <Clock size={16} />
                {salon.openTime?.slice(0, 5)} - {salon.closeTime?.slice(0, 5)}
              </p>
            </div>
          </aside>
          <main className="my-salon-main-content">
            <section className="my-salon-panel">
              <h2>About the salon</h2>
              <p>{salon.description || "No description provided."}</p>
            </section>
          </main>
        </div>
      </div>
      <ConfirmDialog
        open={deleteSalonModalOpen}
        title="Delete your salon?"
        message="This will remove your salon from the platform."
        confirmText="Delete salon"
        danger
        loading={deletingSalon}
        onCancel={() => setDeleteSalonModalOpen(false)}
        onConfirm={handleDeleteSalon}
      />
    </section>
  );
}
export default MySalon;
