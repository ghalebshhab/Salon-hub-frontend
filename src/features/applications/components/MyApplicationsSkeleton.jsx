import {
  Bone,
  BoneLines,
  HeadBones,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** "My applications": header, filter chips, then application cards. */
export default function MyApplicationsSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section candidate-applications-page"
      label={t("Loading your applications…")}
    >
      <header className="candidate-applications-header">
        <HeadBones copy={PAGE_HEADS.myApplications} />
        <Bone w={170} h={46} r="full" />
      </header>
      <div className="application-filter-bar">
        {[64, 84, 90, 80].map((width, index) => (
          <Bone key={index} w={width} h={36} r="full" />
        ))}
      </div>
      <div className="candidate-applications-list">
        {[0, 1, 2].map((card) => (
          <div className="candidate-application-card skeleton-frame" key={card}>
            <div className="candidate-application-card-top">
              <div className="candidate-application-heading">
                <Bone w={44} h={44} r="lg" />
                <div className="skeleton-head" style={{ gap: 8 }}>
                  <Bone w={90} h={10} />
                  <Bone w="60%" h={20} r="md" />
                </div>
              </div>
              <Bone w={96} h={28} r="full" />
            </div>
            <div className="candidate-application-meta">
              <Bone w={120} h={13} />
              <Bone w={100} h={13} />
              <Bone w={80} h={13} />
            </div>
            <BoneLines count={2} h={12} last="58%" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
