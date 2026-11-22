import {
  Bone,
  HeadBones,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function PanelBones({ rows = 3 }) {
  return (
    <section className="pay-panel skeleton-frame">
      <header className="pay-panel-head">
        <Bone w={38} h={38} r="md" />
        <div className="skeleton-head" style={{ gap: 8 }}>
          <Bone w="44%" h={18} r="md" />
          <Bone w="70%" h={11} />
        </div>
      </header>
      <div style={{ display: "grid", gap: 14 }}>
        {Array.from({ length: rows }, (_, row) => (
          <div
            key={row}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Bone w={36} h={36} r="full" />
            <Bone w="38%" h={13} />
            <Bone w={70} h={14} style={{ marginInlineStart: "auto" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** The payments page: header with period buttons, five numbers, two panels. */
export default function PaymentsSkeleton() {
  return (
    <SkeletonPage as="main" className="container section pay-page">
      <header className="pay-page-head">
        <HeadBones copy={PAGE_HEADS.payments} />
        <div className="pay-page-tools">
          <Bone w={240} h={40} r="full" />
          <Bone w={40} h={40} r="full" />
        </div>
      </header>
      <Bone w={220} h={12} style={{ margin: "4px 0 16px" }} />
      <div className="pay-kpis">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="skeleton-block pay-kpi-skeleton" />
        ))}
      </div>
      <div className="pay-layout">
        <PanelBones />
        <PanelBones rows={2} />
      </div>
    </SkeletonPage>
  );
}
