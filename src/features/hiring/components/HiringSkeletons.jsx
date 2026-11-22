import {
  Bone,
  BoneLines,
  HeadBones,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** Hiring post cards while the list loads. */
export function HiringCardsBones({ count = 6 }) {
  return (
    <div className="hiring-grid">
      {Array.from({ length: count }, (_, card) => (
        <div className="hiring-card skeleton-frame" key={card}>
          <div className="hiring-top">
            <div className="skeleton-head" style={{ gap: 8 }}>
              <Bone w="62%" h={20} r="md" />
              <Bone w="46%" h={12} />
            </div>
            <Bone w={60} h={24} r="full" />
          </div>
          <div className="hiring-description">
            <BoneLines count={3} h={12} gap={10} last="66%" />
          </div>
          <div className="hiring-meta">
            <Bone w="44%" h={12} />
            <Bone w="30%" h={12} />
          </div>
          <Bone h={46} r="full" />
        </div>
      ))}
    </div>
  );
}

/** The careers page: centered-left title, then the post cards. */
export function HiringPostsSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section"
      label={t("Finding career opportunities…")}
    >
      <div className="section-title left">
        <HeadBones bare copy={PAGE_HEADS.hiringPosts} />
      </div>
      <HiringCardsBones />
    </SkeletonPage>
  );
}

function FieldBones({ tall = false }) {
  return (
    <div className="form-group">
      <Bone w={110} h={11} style={{ marginBottom: 10 }} />
      <Bone h={tall ? 120 : 48} r="12px" />
    </div>
  );
}

/** "Apply for this position": the wide card with the application form. */
export function ApplyHiringSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="auth-page"
      label={t("Preparing the application…")}
    >
      <div className="auth-card wide skeleton-frame">
        <Bone w="64%" h={34} r="md" />
        <Bone w="82%" h={13} style={{ margin: "14px 0 24px" }} />
        <FieldBones />
        <FieldBones />
        <FieldBones tall />
        <Bone h={48} r="full" style={{ marginTop: 8 }} />
        <Bone w={100} h={42} r="full" style={{ margin: "18px auto 0" }} />
      </div>
    </SkeletonPage>
  );
}

/** "Create hiring post": one form card with paired fields. */
export function CreateHiringPostSkeleton() {
  return (
    <SkeletonPage as="section" className="form-page">
      <div className="form-card skeleton-frame">
        <Bone w="60%" h={34} r="md" />
        <Bone w="80%" h={13} style={{ margin: "14px 0 24px" }} />
        <FieldBones />
        <FieldBones tall />
        <FieldBones />
        {[0, 1, 2].map((row) => (
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
