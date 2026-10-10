import useMySalon from "../hooks/useMySalon.js";

import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Eye,
  Image,
  Mail,
  MapPin,
  Phone,
  Plus,
  Scissors,
  Sparkles,
  Users,
  UsersRound,
  BriefcaseBusiness,
} from "lucide-react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import { Trash2 } from "lucide-react";

import SalonMediaGrid from "../../media/components/SalonMediaGrid.jsx";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function MySalon() {
  const {
    salon,
    employees,
    mediaPosts,
    loading,
    error,
    deleteSalonModalOpen,
    setDeleteSalonModalOpen,
    deletingSalon,
    formatTime,
    handleDeleteSalon,
    getImages,
  } = useMySalon();

  if (loading) {
    return <Loading />;
  }

  if (error || !salon) {
    return (
      <section className="container section">
        <div className="my-salon-empty-wrap">
          <EmptyState
            title="No salon found"
            message={
              error ||
              "You haven't created a salon yet. Create one to get started."
            }
          />

          <Link className="btn btn-primary" to="/owner/create-salon">
            <Plus size={18} />
            Create My Salon
          </Link>
        </div>
      </section>
    );
  }

  const images = getImages(salon);
  const coverImage = images[0];
  const galleryImages = images.slice(0, 4);

  const currentEmployees = salon.currentNumOfEmployees ?? employees.length;
  const maxEmployees = salon.maxNumOfEmployees ?? 0;
  const availableSlots = Math.max(maxEmployees - currentEmployees, 0);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE",
  );
  const invitedEmployees = employees.filter(
    (employee) => employee.status === "INVITED",
  );

  return (
    <section className="my-salon-page">
      <div className="container section">
        <div className="my-salon-hero">
          <div className="my-salon-cover">
            {coverImage ? (
              <img src={coverImage} alt={salon.name} />
            ) : (
              <div className="my-salon-cover-placeholder">
                <Scissors size={44} />
                <span>{salon.name?.charAt(0)?.toUpperCase() || "S"}</span>
              </div>
            )}

            <div className="my-salon-cover-shade"></div>

            <div className="my-salon-floating-status">
              <SalonStatusBadge state={salon.state} />
            </div>
          </div>

          <div className="my-salon-hero-content">
            <div>
              <span className="eyebrow">Salon control center</span>
              <h1>{salon.name}</h1>

              <p className="my-salon-location">
                <MapPin size={17} />
                {salon.city} • {salon.address}
              </p>
            </div>

            <div className="my-salon-hero-actions">
              <Link className="btn btn-primary" to={`/salons/${salon.salonId}`}>
                <Eye size={18} />
                Public View
              </Link>

              <Link className="btn btn-secondary" to="/owner/services">
                <Scissors size={18} />
                Manage Services
              </Link>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => setDeleteSalonModalOpen(true)}
              >
                <Trash2 size={18} />
                Delete Salon
              </button>

              <Link className="btn btn-secondary" to="/owner/bookings">
                <CalendarCheck size={18} />
                Bookings
              </Link>
            </div>

            <div className="my-salon-mini-stats">
              <div>
                <Clock size={20} />
                <strong>
                  {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
                </strong>
                <span>Working hours</span>
              </div>

              <div>
                <UsersRound size={20} />
                <strong>
                  {currentEmployees}/{maxEmployees || "—"}
                </strong>
                <span>Team capacity</span>
              </div>

              <div>
                <Image size={20} />
                <strong>{mediaPosts.length}</strong>
                <span>Media posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-salon-actions-grid">
          <Link
            className="my-salon-action-card primary-action"
            to="/owner/create-media-post"
          >
            <div>
              <Image />
            </div>
            <h3>Post Media</h3>
            <p>Share photos and videos from your salon work.</p>
          </Link>

          <Link className="my-salon-action-card" to="/owner/create-hiring-post">
            <div>
              <BriefcaseBusiness />
            </div>
            <h3>Create Hiring</h3>
            <p>Publish a hiring post when you need team members.</p>
          </Link>

          <Link className="my-salon-action-card" to="/owner/employees">
            <div>
              <Users />
            </div>
            <h3>Employees</h3>
            <p>Track invited and active employees in your salon.</p>
          </Link>

          <Link className="my-salon-action-card" to="/owner/create-service">
            <div>
              <Plus />
            </div>
            <h3>Add Service</h3>
            <p>Create a new service customers can book.</p>
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
                {salon.address || "—"}
              </p>
            </div>

            <div className="my-salon-side-card">
              <h3>Owner Info</h3>

              <div className="my-salon-owner-mini">
                <div className="my-salon-owner-avatar">
                  {salon.ownerName?.charAt(0)?.toUpperCase() || "O"}
                </div>

                <div>
                  <strong>{salon.ownerName || "Owner"}</strong>
                  <span>{salon.ownerEmail || "No email"}</span>
                </div>
              </div>

              <p>
                <Phone size={16} />
                {salon.ownerPhoneNumber || "—"}
              </p>
            </div>

            <div className="my-salon-side-card capacity-card">
              <h3>Team Capacity</h3>

              <div className="capacity-number">
                {currentEmployees}
                <span>/ {maxEmployees || "—"}</span>
              </div>

              <p>
                <Sparkles size={16} />
                {availableSlots} available employee slots
              </p>
            </div>
          </aside>

          <main className="my-salon-main-content">
            <section className="my-salon-panel">
              <div className="my-salon-panel-header">
                <div>
                  <span className="eyebrow">Team status</span>
                  <h2>Employees overview</h2>
                  <p>See active and invited employees in your salon.</p>
                </div>

                <Link
                  className="btn btn-secondary btn-small"
                  to="/owner/employees"
                >
                  Manage Team
                </Link>
              </div>

              <div className="my-salon-team-summary">
                <div className="team-summary-card active-team">
                  <strong>{activeEmployees.length}</strong>
                  <span>Active employees</span>
                </div>

                <div className="team-summary-card invited-team">
                  <strong>{invitedEmployees.length}</strong>
                  <span>Invited employees</span>
                </div>

                <div className="team-summary-card empty-team">
                  <strong>{availableSlots}</strong>
                  <span>Available slots</span>
                </div>
              </div>

              {employees.length === 0 ? (
                <div className="empty-state">
                  <h3>No employees yet</h3>
                  <p>
                    Add employees from the Employees page or while creating a
                    salon.
                  </p>
                </div>
              ) : (
                <div className="my-salon-employee-strip">
                  {employees.slice(0, 6).map((employee) => (
                    <div className="my-salon-employee-chip" key={employee.id}>
                      <div className="employee-chip-avatar">
                        {employee.imageUrl ? (
                          <img
                            src={employee.imageUrl}
                            alt={employee.fullName}
                          />
                        ) : (
                          employee.fullName?.charAt(0)?.toUpperCase() || "E"
                        )}
                      </div>

                      <div>
                        <strong>{employee.fullName}</strong>
                        <span>{employee.specialty || employee.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="my-salon-panel">
              <div className="my-salon-panel-header">
                <div>
                  <span className="eyebrow">Salon visuals</span>
                  <h2>Gallery preview</h2>
                  <p>Images you uploaded for the salon profile.</p>
                </div>
              </div>

              {galleryImages.length === 0 ? (
                <div className="empty-state">
                  <h3>No profile images</h3>
                  <p>
                    Add image URLs in your salon data to make the profile stand
                    out.
                  </p>
                </div>
              ) : (
                <div className="my-salon-gallery-preview">
                  {galleryImages.map((imageUrl, index) => (
                    <img
                      key={imageUrl + index}
                      src={imageUrl}
                      alt={`Salon image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="my-salon-panel">
              <div className="my-salon-panel-header">
                <div>
                  <span className="eyebrow">Recent work</span>
                  <h2>Media posts</h2>
                  <p>Photos and videos shared from your salon.</p>
                </div>

                <Link
                  className="btn btn-secondary btn-small"
                  to="/owner/create-media-post"
                >
                  Add Media
                </Link>
              </div>

              <SalonMediaGrid mediaPosts={mediaPosts} />
            </section>
          </main>
        </div>
      </div>
      <ConfirmDialog
        open={deleteSalonModalOpen}
        title="Delete your salon?"
        message="Your salon will be hidden from customers. Your data will stay in the database because this is a soft delete."
        confirmText="Yes, delete salon"
        cancelText="No, keep it"
        danger={true}
        loading={deletingSalon}
        onCancel={() => setDeleteSalonModalOpen(false)}
        onConfirm={handleDeleteSalon}
      />
    </section>
  );
}

export default MySalon;
