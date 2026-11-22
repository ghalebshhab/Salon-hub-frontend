import {
  Bone,
  BoneLines,
  HeadBones,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** "My salon": cover and title, shortcut cards, side cards and about panel. */
export function MySalonSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="my-salon-page"
      label={t("Loading your salon…")}
    >
      <div className="container section">
        <div className="my-salon-hero">
          <div className="my-salon-cover skeleton-cover">
            <Bone r="0" />
          </div>
          <div className="my-salon-hero-content">
            <Bone w="70%" h={46} r="md" />
            <Bone w={140} h={14} style={{ margin: "16px 0 24px" }} />
            <div className="my-salon-hero-actions">
              <Bone w={140} h={46} r="full" />
              <Bone w={150} h={46} r="full" />
              <Bone w={130} h={46} r="full" />
            </div>
          </div>
        </div>
        <div className="my-salon-actions-grid">
          {[0, 1, 2, 3, 4].map((card) => (
            <div className="my-salon-action-card skeleton-frame" key={card}>
              <Bone w={40} h={40} r="lg" />
              <Bone w="62%" h={16} style={{ margin: "14px 0 8px" }} />
              <Bone w="84%" h={11} />
            </div>
          ))}
        </div>
        <div className="my-salon-dashboard-layout">
          <div className="my-salon-sidebar">
            {[3, 2].map((lines, card) => (
              <div className="my-salon-side-card skeleton-frame" key={card}>
                <Bone w="54%" h={18} r="md" style={{ marginBottom: 16 }} />
                <BoneLines count={lines} h={13} gap={14} last="60%" />
              </div>
            ))}
          </div>
          <div className="my-salon-main-content">
            <section className="my-salon-panel skeleton-frame">
              <Bone w="36%" h={24} r="md" style={{ marginBottom: 16 }} />
              <BoneLines count={4} h={13} gap={12} last="54%" />
            </section>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

function EditSectionBones({ wide = false, lines = 2 }) {
  return (
    <section
      className={`owner-edit-section skeleton-frame${wide ? " owner-edit-wide" : ""}`}
    >
      <header className="owner-edit-section-heading">
        <div className="skeleton-head" style={{ gap: 10 }}>
          <Bone w={80} h={10} />
          <Bone w="48%" h={22} r="md" />
        </div>
        <Bone w={40} h={40} r="full" />
      </header>
      <BoneLines count={lines} h={13} gap={12} last="58%" />
    </section>
  );
}

/** The live salon editor: top bar, cover and copy, then the edit sections. */
export function EditSalonSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="owner-salon-editor-page salon-details-page"
      label={t("Preparing your salon profile…")}
    >
      <div className="container section">
        <header className="owner-editor-topbar">
          <HeadBones copy={PAGE_HEADS.editSalon} />
          <Bone w={170} h={46} r="full" />
        </header>
        <div className="salon-details-hero owner-editor-hero">
          <div className="salon-details-media skeleton-cover">
            <Bone r="0" />
          </div>
          <div className="salon-details-hero-copy">
            <Bone w={150} h={28} r="full" />
            <Bone w="72%" h={46} r="md" style={{ margin: "18px 0" }} />
            <Bone w={130} h={14} />
            <div style={{ margin: "18px 0 24px" }}>
              <BoneLines count={3} h={13} gap={12} last="64%" />
            </div>
            <Bone w={160} h={46} r="full" />
          </div>
        </div>
        <div className="owner-edit-grid">
          <EditSectionBones wide />
          <EditSectionBones />
          <EditSectionBones />
          <EditSectionBones wide lines={1} />
        </div>
      </div>
    </SkeletonPage>
  );
}

function FieldBones() {
  return (
    <div className="form-group">
      <Bone w={110} h={11} style={{ marginBottom: 10 }} />
      <Bone h={48} r="12px" />
    </div>
  );
}

/** "Create salon": the single form card with its paired fields. */
export function CreateSalonSkeleton() {
  return (
    <SkeletonPage as="section" className="form-page">
      <div className="form-card create-salon-pro-form skeleton-frame">
        <div className="create-salon-header">
          <HeadBones bare copy={PAGE_HEADS.createSalon} textClass="muted" />
        </div>
        {[0, 1].map((row) => (
          <div className="form-row" key={row}>
            <FieldBones />
            <FieldBones />
          </div>
        ))}
        <div className="form-group">
          <Bone w={110} h={11} style={{ marginBottom: 10 }} />
          <Bone h={110} r="12px" />
        </div>
        {[0, 1].map((row) => (
          <div className="form-row" key={row}>
            <FieldBones />
            <FieldBones />
          </div>
        ))}
        <Bone h={48} r="full" style={{ marginTop: 8 }} />
      </div>
    </SkeletonPage>
  );
}
