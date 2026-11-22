import {
  Bone,
  BoneLines,
  HeadBones,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** A section heading with its real label and title text. */
function SectionHeading({ eyebrow, title, search = false }) {
  return (
    <div className="employment-section-heading">
      <div>
        <span className="eyebrow">
          <TextBone>{t(eyebrow)}</TextBone>
        </span>
        <h2>
          <TextBone>{t(title)}</TextBone>
        </h2>
      </div>
      {search && <Bone w="min(320px, 100%)" h={46} r="full" />}
    </div>
  );
}

function RequestCardBones() {
  return (
    <div className="employment-card skeleton-frame">
      <div className="employment-card-heading">
        <Bone w={44} h={44} r="lg" />
        <div className="skeleton-head" style={{ gap: 8 }}>
          <Bone w={90} h={10} />
          <Bone w="64%" h={18} r="md" />
        </div>
        <Bone w={84} h={26} r="full" />
      </div>
      <div className="employment-card-meta">
        <Bone w={110} h={12} />
        <Bone w={90} h={12} />
      </div>
      <BoneLines count={2} h={12} last="56%" />
    </div>
  );
}

/** Candidate cards in the owner's talent search. */
export function CandidateCardsBones({ count = 4 }) {
  return (
    <div className="candidate-directory-grid">
      {Array.from({ length: count }, (_, card) => (
        <div className="candidate-directory-card skeleton-frame" key={card}>
          <div className="candidate-directory-heading">
            <Bone w={52} h={52} r="full" />
            <div className="skeleton-head" style={{ gap: 8 }}>
              <Bone w="58%" h={18} r="md" />
              <Bone w="40%" h={12} />
            </div>
          </div>
          <div className="candidate-directory-bio">
            <BoneLines count={2} h={12} last="64%" />
          </div>
          <div
            className="candidate-directory-skills"
            style={{ display: "flex", gap: 8 }}
          >
            <Bone w={72} h={26} r="full" />
            <Bone w={88} h={26} r="full" />
            <Bone w={64} h={26} r="full" />
          </div>
          <div className="employment-card-actions">
            <Bone w={120} h={38} r="full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The employee's employment center: hero with count, then request cards. */
export function EmploymentCenterSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section employment-page"
      label={t("Loading your employment center…")}
    >
      <header className="employment-hero">
        <HeadBones copy={PAGE_HEADS.employmentCenter} />
        <div className="employment-summary-card skeleton-frame">
          <Bone w={24} h={24} r="md" />
          <Bone w={40} h={30} r="md" />
          <Bone w={110} h={12} />
        </div>
      </header>
      <section className="employment-section">
        <SectionHeading
          eyebrow="Invitations and requests"
          title="Your salon opportunities"
        />
        <div className="employment-grid">
          <RequestCardBones />
          <RequestCardBones />
        </div>
      </section>
    </SkeletonPage>
  );
}

/** The owner's employment page: hero with three counts, then talent search. */
export function OwnerEmploymentSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section employment-page"
      label={t("Loading employment workflows…")}
    >
      <header className="employment-hero">
        <HeadBones copy={PAGE_HEADS.ownerEmployment} />
        <div className="employment-summary-grid">
          {[0, 1, 2].map((item) => (
            <span key={item}>
              <Bone w={34} h={28} r="md" />
              <Bone w={90} h={11} />
            </span>
          ))}
        </div>
      </header>
      <section className="employment-section">
        <SectionHeading search />
        <CandidateCardsBones />
      </section>
    </SkeletonPage>
  );
}
