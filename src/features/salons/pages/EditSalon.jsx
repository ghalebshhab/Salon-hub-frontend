import {
  Clock3,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SalonCoverPlaceholder from "../components/SalonCoverPlaceholder.jsx";
import { EditSalonSkeleton } from "../components/OwnerSalonSkeletons.jsx";
import SalonWorkGallery from "../../media/components/SalonWorkGallery.jsx";
import { optimizedCloudinaryImage } from "../../media/model/cloudinaryMedia.js";
import ReviewsList from "../../reviews/components/ReviewsList.jsx";
import SalonServicesList from "../../services/components/SalonServicesList.jsx";
import EditableSalonSection from "../components/EditableSalonSection.jsx";
import SalonCoverEditor from "../components/SalonCoverEditor.jsx";
import SalonTeam from "../components/team/SalonTeam.jsx";
import SalonClosuresPanel from "../components/SalonClosuresPanel.jsx";
import SalonLocationField from "../components/SalonLocationField.jsx";
import {
  AvailabilityEditor,
  CityEditor,
  ContactEditor,
  IdentityEditor,
} from "../components/SalonSectionEditors.jsx";
import SalonStatusBadge from "../components/SalonStatusBadge.jsx";
import useEditSalon from "../hooks/useEditSalon.js";
import ErrorPage from "../../../shared/components/ErrorPage.jsx";
import t from "../../../shared/i18n/t.js";
import { salonDescription } from "../model/salonPage.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

const formatTime = (value) => value?.slice(0, 5) || t("Not listed");

export default function EditSalon() {
  const [activeSection, setActiveSection] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const editor = useEditSalon();

  if (editor.loading) return <EditSalonSkeleton />;
  if (!editor.salon) return <ErrorPage kind="notFound" />;

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
            <span className="eyebrow">{t(PAGE_HEADS.editSalon.eyebrow)}</span>
            <h1>{t(PAGE_HEADS.editSalon.title)}</h1>
            <p>{t(PAGE_HEADS.editSalon.text)}</p>
          </div>
          <Link className="btn btn-secondary" to={`/salons/${salonId}`}>
            <Eye size={17} /> {t("View public page")}
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
                alt={t("{name} salon", { name: salon.name })}
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
              <span className="eyebrow">{t("Salon profile")}</span>
              <SalonStatusBadge state={salon.state} />
            </div>
            <h1>{salon.name}</h1>
            <p className="salon-details-location">
              <MapPin aria-hidden="true" />
              <span>
                {salon.city ? t(salon.city) : t("Location not listed")}
              </span>
            </p>
            <p className="salon-details-description">
              {salonDescription(salon) || t("Add the story behind your salon.")}
            </p>
            <button
              className="btn btn-primary owner-hero-edit"
              type="button"
              onClick={() => beginEdit("identity")}
            >
              <Pencil size={17} /> {t("Edit name and story")}
            </button>
            <div className="salon-details-hero-meta">
              <div>
                <Clock3 aria-hidden="true" />
                <span>{t("Hours")}</span>
                <strong>
                  {formatTime(salon.openTime)} – {formatTime(salon.closeTime)}
                </strong>
              </div>
              <div>
                <UsersRound aria-hidden="true" />
                <span>{t("Team capacity")}</span>
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
            eyebrow={t("Identity")}
            title={t("Name and salon story")}
            description={t(
              "This copy leads the public page and helps guests understand the experience.",
            )}
            className="owner-edit-wide"
            editor={
              <IdentityEditor form={form} onChange={editor.handleChange} />
            }
          >
            <p className="owner-edit-summary">{salonDescription(salon)}</p>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("contact")}
            eyebrow={t("Contact")}
            title={t("How guests reach you")}
            editor={
              <ContactEditor form={form} onChange={editor.handleChange} />
            }
          >
            <div className="owner-edit-detail-list">
              <span>
                <Phone size={17} /> {salon.phoneNumber || t("Not listed")}
              </span>
              <span>
                <Mail size={17} /> {salon.email || t("Not listed")}
              </span>
            </div>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("availability")}
            eyebrow={t("Availability")}
            title={t("Hours and team capacity")}
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
                <UsersRound size={17} />{" "}
                {t("Up to {maxNumOfEmployees} team members", {
                  maxNumOfEmployees: salon.maxNumOfEmployees,
                })}
              </span>
            </div>
          </EditableSalonSection>

          <EditableSalonSection
            {...sectionProps("location")}
            eyebrow={t("Location")}
            title={t("Help guests arrive with confidence")}
            description={t(
              "Pin the exact entrance on Google Maps. Guests can open it and get directions from the salon page.",
            )}
            className="owner-edit-wide"
            editor={<CityEditor form={form} onChange={editor.handleChange} />}
          >
            <div className="owner-location-summary">
              <span className="owner-location-city">
                <MapPin size={17} aria-hidden="true" /> {t("City:")}
                <strong>{salon.city ? t(salon.city) : t("Not listed")}</strong>
              </span>
              <SalonLocationField
                latitude={salon.latitude}
                longitude={salon.longitude}
                saving={editor.saving}
                onConfirm={editor.saveLocation}
                onRemove={editor.removeLocation}
              />
            </div>
          </EditableSalonSection>

          <SalonClosuresPanel salonId={salonId} />
        </div>

        <div className="owner-public-preview">
          <div className="owner-public-preview-heading">
            <div>
              <span className="eyebrow">{t("Public content")}</span>
              <h2>{t("Manage the rest of the salon experience")}</h2>
              <p>
                {t(
                  "Review the live content here, then use the focused workspace for structural changes.",
                )}
              </p>
            </div>
          </div>

          <section className="salon-details-section">
            <div className="salon-section-heading owner-preview-section-heading">
              <div>
                <span className="eyebrow">{t("The menu")}</span>
                <h2>{t("Services")}</h2>
              </div>
              <Link
                className="btn btn-secondary btn-small"
                to="/owner/services"
              >
                {t("Manage services")}
              </Link>
            </div>
            <SalonServicesList salonId={salonId} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading owner-preview-section-heading">
              <div>
                <span className="eyebrow">{t("Your professionals")}</span>
                <h2>{t("Salon team")}</h2>
              </div>
              <Link
                className="btn btn-secondary btn-small"
                to="/owner/employees"
              >
                {t("Manage team")}
              </Link>
            </div>
            <SalonTeam employees={editor.employees} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading">
              <span className="eyebrow">{t("Team portfolio")}</span>
              <h2>{t("Recent work")}</h2>
            </div>
            <SalonWorkGallery salonId={salonId} />
          </section>

          <section className="salon-details-section">
            <div className="salon-section-heading">
              <span className="eyebrow">{t("Client notes")}</span>
              <h2>{t("Guest reviews")}</h2>
            </div>
            <ReviewsList salonId={salonId} />
          </section>
        </div>
      </div>
    </section>
  );
}
