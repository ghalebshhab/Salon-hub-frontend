import {
  Bone,
  BoneLines,
  HeadBones,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** The plan body while it loads: current plan with meters, then plan cards. */
export function PlanBodyBones() {
  return (
    <>
      <div className="plan-top">
        <section className="owner-panel plan-current skeleton-frame">
          <div className="plan-current-head">
            <Bone w={42} h={42} r="md" />
            <div className="skeleton-head" style={{ gap: 10 }}>
              <Bone w={80} h={10} />
              <Bone w="44%" h={26} r="md" />
              <Bone w="70%" h={12} />
            </div>
          </div>
          <div className="plan-meters" style={{ display: "grid", gap: 16 }}>
            {[0, 1, 2].map((meter) => (
              <div key={meter} style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Bone w="36%" h={12} />
                  <Bone w={50} h={12} />
                </span>
                <Bone h={8} r="full" />
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="plan-compare">
        <div className="plan-section-head">
          <div className="skeleton-head" style={{ gap: 10 }}>
            <Bone w={80} h={10} />
            <Bone w={140} h={28} r="md" />
            <Bone w="min(380px, 90%)" h={12} />
          </div>
          <Bone w={200} h={40} r="full" />
        </div>
        <div className="plan-grid">
          {[0, 1, 2].map((card) => (
            <div className="plan-card skeleton-frame" key={card}>
              <Bone w="46%" h={22} r="md" />
              <Bone w="80%" h={12} style={{ margin: "10px 0 20px" }} />
              <Bone w="54%" h={34} r="md" style={{ marginBottom: 20 }} />
              <BoneLines count={4} h={12} gap={12} last="70%" />
              <Bone h={44} r="full" style={{ marginTop: 22 }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** The whole "My plan" page while its code loads. */
export default function PlanSkeleton() {
  return (
    <SkeletonPage
      as="main"
      className="container section plan-page"
      label={t("Loading")}
    >
      <header className="plan-page-head">
        <HeadBones copy={PAGE_HEADS.plan} />
      </header>
      <PlanBodyBones />
    </SkeletonPage>
  );
}
