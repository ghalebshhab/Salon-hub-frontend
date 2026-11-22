import {
  BriefcaseBusiness,
  CalendarDays,
  CalendarClock,
  Clock,
  Edit3,
  Eye,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import SalonCoverPlaceholder from "../components/SalonCoverPlaceholder.jsx";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import { MySalonSkeleton } from "../components/OwnerSalonSkeletons.jsx";
import useMySalon from "../hooks/useMySalon.js";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import SalonCoverEditor from "../components/SalonCoverEditor.jsx";
import { optimizedCloudinaryImage } from "../../media/model/cloudinaryMedia.js";
import t from "../../../shared/i18n/t.js";
import { salonDescription } from "../model/salonPage.js";

function MySalon() {
  const [uploadedImage, setUploadedImage] = useState("");
  const {
    salon,
    loading,
    error,
    deleteSalonModalOpen,
    setDeleteSalonModalOpen,
    deletingSalon,
    resubmittingSalon,
    handleResubmitSalon,
    handleDeleteSalon,
  } = useMySalon();
  if (loading) return <MySalonSkeleton />;
  if (error || !salon)
    return (
      <section className="container section">
        <EmptyState
          title={t("No salon found")}
          message={error || t("Create a salon to get started.")}
        />
        <Link className="btn btn-primary" to="/owner/create-salon">
          <Plus size={18} />
          {t("Create My Salon")}
        </Link>
      </section>
    );
  const image = uploadedImage || salon.images?.[0];
  return (
    <section className="my-salon-page">
      <div className="container section">
        <div className="my-salon-hero">
          <div className="my-salon-cover">
            {image ? (
              <img
                src={optimizedCloudinaryImage(image, {
                  width: 1400,
                  height: 700,
                })}
                alt={salon.name}
              />
            ) : (
              <SalonCoverPlaceholder name={salon.name} variant="banner" />
            )}
            <div className="my-salon-floating-status">
              <SalonStatusBadge state={salon.state} />
            </div>
            <div className="my-salon-cover-edit">
              <SalonCoverEditor
                currentUrl={image}
                onUploaded={setUploadedImage}
              />
            </div>
          </div>
          <div className="my-salon-hero-content">
            <h1>{salon.name}</h1>
            {salon.googleMapsUrl ? (
              <a
                className="my-salon-location"
                href={salon.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={17} /> {t(salon.city)}
              </a>
            ) : (
              <p className="my-salon-location">
                <MapPin size={17} />
                {t(salon.city)}
              </p>
            )}
            <div className="my-salon-hero-actions">
              <Link className="btn btn-secondary" to="/owner/my-salon/edit">
                <Edit3 size={18} />
                {t("Edit Salon")}
              </Link>
              <Link className="btn btn-primary" to={`/salons/${salon.salonId}`}>
                <Eye size={18} />
                {t("Public View")}
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => setDeleteSalonModalOpen(true)}
              >
                <Trash2 size={18} />
                {t("Delete Salon")}
              </button>
            </div>
          </div>
        </div>
        <div className="my-salon-actions-grid">
          <Link className="my-salon-action-card" to="/owner/dashboard">
            <LayoutDashboard />
            <h3>{t("Owner Dashboard")}</h3>
            <p>
              {t(
                "Open your salon performance, bookings, team, services, and customer insights.",
              )}
            </p>
          </Link>
          <Link className="my-salon-action-card" to="/owner/employees">
            <CalendarClock />
            <h3>{t("Employees & Schedules")}</h3>
            <p>{t("Assign service skills and weekly working hours.")}</p>
          </Link>
          <Link className="my-salon-action-card" to="/owner/bookings">
            <CalendarDays />
            <h3>{t("Booking Requests")}</h3>
            <p>{t("Review customer requests and manage appointments.")}</p>
          </Link>
          <Link className="my-salon-action-card" to="/owner/create-hiring-post">
            <BriefcaseBusiness />
            <h3>{t("Create Hiring Post")}</h3>
            <p>{t("Publish an opening for your salon.")}</p>
          </Link>
          <Link className="my-salon-action-card" to="/owner/applications">
            <UsersRound />
            <h3>{t("Hiring Applications")}</h3>
            <p>{t("Review candidates who applied.")}</p>
          </Link>
        </div>
        {salon.status === "Rejected" && (
          <section className="my-salon-panel salon-resubmission-panel">
            <div>
              <span className="eyebrow">{t("Action required")}</span>
              <h2>
                {t("Update the rejected details, then resubmit your salon.")}
              </h2>
              <p>
                {salon.rejectionReason ||
                  t(
                    "The administrator requested changes to your salon details.",
                  )}
              </p>
              <small>
                {salon.remainingResubmissions === 1
                  ? t("1 resubmission remaining")
                  : t("{count} resubmissions remaining", {
                      count: salon.remainingResubmissions ?? 0,
                    })}
              </small>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleResubmitSalon}
              disabled={
                resubmittingSalon || (salon.remainingResubmissions ?? 0) <= 0
              }
            >
              <RefreshCw size={18} />
              {resubmittingSalon
                ? t("Resubmitting…")
                : t("Resubmit for review")}
            </button>
          </section>
        )}
        <div className="my-salon-dashboard-layout">
          <aside className="my-salon-sidebar">
            <div className="my-salon-side-card">
              <h3>{t("Contact Details")}</h3>
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
                {salon.city ? t(salon.city) : "—"}
              </p>
            </div>
            <div className="my-salon-side-card">
              <h3>{t("Capacity")}</h3>
              <p>
                <UsersRound size={16} />
                {salon.currentNumOfEmployees ?? 0} /{" "}
                {salon.maxNumOfEmployees ?? "—"} {t("employees")}
              </p>
              <p>
                <Clock size={16} />
                {salon.openTime?.slice(0, 5)} - {salon.closeTime?.slice(0, 5)}
              </p>
            </div>
          </aside>
          <main className="my-salon-main-content">
            <section className="my-salon-panel">
              <h2>{t("About the salon")}</h2>
              <p>{salonDescription(salon) || t("No description provided.")}</p>
            </section>
          </main>
        </div>
      </div>
      <ConfirmDialog
        open={deleteSalonModalOpen}
        title={t("Delete your salon?")}
        message={t("This will remove your salon from the platform.")}
        confirmText={t("Delete salon")}
        danger
        loading={deletingSalon}
        onCancel={() => setDeleteSalonModalOpen(false)}
        onConfirm={handleDeleteSalon}
      />
    </section>
  );
}
export default MySalon;
