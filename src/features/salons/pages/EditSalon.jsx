import {
  Clock3,
  Eye,
  Mail,
  MapPin,
  Phone,
  Settings2,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SalonCoverPlaceholder from "../components/SalonCoverPlaceholder.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import SalonWorkGallery from "../../media/components/SalonWorkGallery.jsx";
import { optimizedCloudinaryImage } from "../../media/model/cloudinaryMedia.js";
import ReviewsList from "../../reviews/components/ReviewsList.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";
import EditableSalonSection from "../components/EditableSalonSection.jsx";
import SalonCoverEditor from "../components/SalonCoverEditor.jsx";
import SalonEmployees from "../components/SalonEmployees.jsx";
import {
  AvailabilityEditor,
  ContactEditor,
  IdentityEditor,
  LocationEditor,
} from "../components/SalonSectionEditors.jsx";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import useEditSalon from "../hooks/useEditSalon.js";

const formatTime = (value) => value?.slice(0, 5) || "Not listed";

export default function EditSalon() {
  const [activeSection, setActiveSection] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const editor = useEditSalon();

  if (editor.loading)
    return <Loading message="Preparing your salon profile…" />;
  if (!editor.salon) return <div className="empty-state">Salon not found.</div>;

  const { salon, form } = editor;
  const salonId = salon.salonId;
  const image = uploadedImage || salon.images?.[0];

  const beginEdit = (section) => {
    editor.resetForm();
    setActiveSection(section);
  };
  const cancelEdit = () => {
    editor.resetForm();
    setActiveSection(null);
  };
  const saveSection = async () => {
    const saved = await editor.save();
    if (saved) setActiveSection(null);
  };
  const sectionProps = (section) => ({
    editing: activeSection === section,
    saving: editor.saving,
    onEdit: () => beginEdit(section),
    onCancel: cancelEdit,
    onSave: saveSection,
  });

  return (
    <section className="owner-salon-editor-page salon-details-page">
      <div className="container section">
        <header className="owner-editor-topbar">
          <div>
            <span className="eyebrow">Live profile editor</span>
            <h1>Shape the page your guests see</h1>
            <p>
              Edit one section at a time without losing the salon-page context.
            </p>
          </div>
          <Link className="btn btn-secondary" to={`/salons/${salonId}`}>
            <Eye size={17} /> View public page
          </Link>
        </header>

        <div className="salon-details-hero owner-editor-hero">
          <div className="salon-details-media">
            {image ? (
              <img
                src={optimizedCloudinaryImage(image, {
                  width: 1400,
                  height: 1000,
                })}
                alt={`${salon.name} salon`}
              />
            ) : (
              <SalonCoverPlaceholder name={salon.name} variant="hero" />
            )}
            <div className="owner-editor-cover-control">
              <SalonCoverEditor
                currentUrl={image}
                onUploaded={setUploadedImage}
              />
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
              <span>{salon.city || "Location not listed"}</span>
            </p>
            <p className="salon-details-description">
              {salon.description || "Add the story behind your salon."}
            </p>
            <button
              className="btn btn-primary owner-hero-edit"
              type="button"
              onClick={() => beginEdit("identity")}
            >
              <Settings2 size={17} /> Edit name and story
            </button>
            <div className="salon-details-hero-meta">
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
                  {salon.currentNumOfEmployees ?? 0} / {salon.maxNumOfEmployees}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="owner-edit-grid">
          <EditableSalonSection
            {...sectionProps("identity")}
            eyebrow="Identity"
            title="Name and salon story"
            description="This copy leads the public page and helps guests understand the experience."
            className="owner-edit-wide"
            editor={
              <IdentityEditor form={form} onChange={editor.handleChange} />
            }
          >
            <p className="owner-edit-summary">{salon.description}</p>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("contact")}
            eyebrow="Contact"
            title="How guests reach you"
            editor={
              <ContactEditor form={form} onChange={editor.handleChange} />
            }
          >
            <div className="owner-edit-detail-list">
              <span>
                <Phone size={17} /> {salon.phoneNumber || "Not listed"}
              </span>
              <span>
                <Mail size={17} /> {salon.email || "Not listed"}
              </span>
            </div>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("availability")}
            eyebrow="Availability"
            title="Hours and team capacity"
            editor={
              <AvailabilityEditor
                form={form}
                setForm={editor.setForm}
                onChange={editor.handleChange}
              />
            }
          >
            <div className="owner-edit-detail-list">
              <span>
                <Clock3 size={17} /> {formatTime(salon.openTime)} –{" "}
                {formatTime(salon.closeTime)}
              </span>
              <span>
                <UsersRound size={17} /> Up to {salon.maxNumOfEmployees} team
                members
              </span>
            </div>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("location")}
            eyebrow="Location"
            title="Help guests arrive with confidence"
            description="Choose the precise map point and keep the public city label accurate."
            className="owner-edit-wide"
            editor={
              <LocationEditor
                form={form}
                setForm={editor.setForm}
                onChange={editor.handleChange}
              />
            }
          >
            <div className="owner-edit-detail-list">
              <span>
                <MapPin size={17} /> {salon.city || "Not listed"}
              </span>
              {salon.googleMapsUrl && (
                <a href={salon.googleMapsUrl} target="_blank" rel="noreferrer">
                  Open saved map location
                </a>
              )}
            </div>
          </EditableSalonSection>
        </div>

        <div className="owner-public-preview">
          <div className="owner-public-preview-heading">
            <div>
              <span className="eyebrow">Public content</span>
              <h2>Manage the rest of the salon experience</h2>
              <p>
                Review the live content here, then use the focused workspace for
                structural changes.
              </p>
            </div>
          </div>

          <section className="salon-details-section">
            <div className="salon-section-heading owner-preview-section-heading">
              <div>
                <span className="eyebrow">The menu</span>
                <h2>Services</h2>
              </div>
              <Link
                className="btn btn-secondary btn-small"
                to="/owner/services"
              >
                Manage services
              </Link>
            </div>
            <SalonServicesList salonId={salonId} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading owner-preview-section-heading">
              <div>
                <span className="eyebrow">Your professionals</span>
                <h2>Salon team</h2>
              </div>
              <Link
                className="btn btn-secondary btn-small"
                to="/owner/employees"
              >
                Manage team
              </Link>
            </div>
            <SalonEmployees employees={editor.employees} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading">
              <span className="eyebrow">Team portfolio</span>
              <h2>Recent work</h2>
            </div>
            <SalonWorkGallery salonId={salonId} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading">
              <span className="eyebrow">Client notes</span>
              <h2>Guest reviews</h2>
            </div>
            <ReviewsList salonId={salonId} />
          </section>
        </div>
      </div>
    </section>
  );
}
