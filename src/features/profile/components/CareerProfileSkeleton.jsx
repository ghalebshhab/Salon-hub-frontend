import {
  Bone,
  HeadBones,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** A field with its real label text and an input of the real height. */
function FieldBones({ label, tall = false }) {
  return (
    <div className="form-group">
      <label>
        <TextBone>{t(label)}</TextBone>
      </label>
      <Bone h={tall ? 120 : 51} r="12px" />
    </div>
  );
}

/** The career profile form card while it loads. */
export default function CareerProfileSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="form-page"
      label={t("Loading your career profile…")}
    >
      <div className="form-card skeleton-frame">
        <HeadBones
          bare
          copy={{ ...PAGE_HEADS.careerProfile, textAfter: "0%." }}
          textClass="muted"
        />
        <div className="form-row">
          <FieldBones label="Date of birth" />
          <FieldBones label="Years of experience" />
        </div>
        <FieldBones label="Skills, separated by commas" />
        <FieldBones label="Preferred work locations, separated by commas" />
        <FieldBones label="Resume URL" />
        <FieldBones label="Portfolio URL" />
        <FieldBones label="Professional bio" tall />
        <Bone h={48} r="full" style={{ marginTop: 8 }} />
      </div>
    </SkeletonPage>
  );
}
