import {
  Bone,
  BoneLines,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";

const CHART_BARS = [38, 62, 45, 80, 55, 70, 42, 88, 60, 74, 50, 66];

function PanelHeading({ action = 96 }) {
  return (
    <div className="owner-panel-heading">
      <div style={{ display: "grid", gap: 10, flex: 1 }}>
        <Bone w={84} h={10} />
        <Bone w="52%" h={22} r="md" />
      </div>
      {action ? <Bone w={action} h={34} r="full" /> : null}
    </div>
  );
}

/**
 * The owner dashboard while it loads, in its real layout: greeting header,
 * meta row, four stat cards and the small numbers, the chart and revenue mix,
 * the team panels and the bookings table.
 */
export default function OwnerDashboardSkeleton() {
  return (
    <SkeletonPage
      as="main"
      className="owner-dashboard-page"
      label={t("Loading your salon dashboard")}
    >
      <div className="owner-dashboard-shell">
        <header className="owner-dashboard-header">
          <div style={{ display: "grid", gap: 12, flex: 1 }}>
            <Bone w={120} h={11} />
            <Bone w="min(420px, 80%)" h={40} r="md" />
            <Bone w="min(460px, 90%)" h={14} />
          </div>
          <div className="owner-header-actions">
            <Bone w={150} h={42} r="full" />
            <Bone w={140} h={42} r="md" />
            <Bone w={170} h={42} r="full" />
          </div>
        </header>
        <div className="owner-meta-row">
          <Bone w={170} h={13} />
          <Bone w={120} h={13} />
          <Bone w={34} h={34} r="full" />
          <Bone w={34} h={34} r="full" />
          <Bone w={34} h={34} r="full" />
        </div>

        <section className="owner-stats">
          <div className="owner-stats-grid">
            {[0, 1, 2, 3].map((card) => (
              <div className="owner-stat-card skeleton-frame" key={card}>
                <Bone w={38} h={38} r="md" />
                <Bone w="54%" h={12} style={{ marginTop: 14 }} />
                <Bone w="46%" h={30} r="md" style={{ margin: "10px 0" }} />
                <div className="owner-stat-foot">
                  <Bone w={56} h={20} r="full" />
                  <Bone w="50%" h={10} />
                </div>
              </div>
            ))}
          </div>
          <div className="owner-mini-stats">
            {[0, 1, 2, 3].map((stat) => (
              <div className="owner-mini-stat skeleton-frame" key={stat}>
                <Bone w={16} h={16} r="full" />
                <Bone w="58%" h={12} />
                <Bone w={28} h={16} />
              </div>
            ))}
          </div>
        </section>

        <section className="owner-section-grid">
          <div className="owner-panel owner-analytics skeleton-frame">
            <PanelHeading action={150} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3%",
                height: 220,
                padding: "12px 4px 0",
              }}
            >
              {CHART_BARS.map((height, index) => (
                <Bone key={index} w="5%" h={`${height}%`} r="6px 6px 2px 2px" />
              ))}
            </div>
          </div>
          <div className="owner-panel owner-breakdown skeleton-frame">
            <PanelHeading action={0} />
            <div style={{ display: "grid", gap: 18 }}>
              {[80, 64, 48, 36, 24].map((width, index) => (
                <div key={index} style={{ display: "grid", gap: 8 }}>
                  <span style={{ display: "flex", gap: 12 }}>
                    <Bone w="48%" h={12} />
                    <Bone w={54} h={12} style={{ marginInlineStart: "auto" }} />
                  </span>
                  <Bone w={`${width}%`} h={8} r="full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="owner-section-grid owner-team-grid">
          <div className="owner-panel skeleton-frame">
            <PanelHeading action={110} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Bone w={64} h={64} r="full" />
              <div style={{ flex: 1 }}>
                <BoneLines count={2} h={14} last="50%" />
              </div>
            </div>
          </div>
          <div className="owner-panel skeleton-frame">
            <PanelHeading action={0} />
            <div style={{ display: "grid", gap: 14 }}>
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Bone w={18} h={14} />
                  <Bone w={38} h={38} r="full" />
                  <Bone w="40%" h={13} />
                  <Bone w={44} h={13} style={{ marginInlineStart: "auto" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="owner-panel owner-bookings skeleton-frame">
          <PanelHeading action={110} />
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <Bone h={42} r="md" />
            <Bone w={110} h={42} r="md" />
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[0, 1, 2, 3, 4].map((row) => (
              <div
                key={row}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <Bone w={36} h={36} r="full" />
                <Bone w="24%" h={13} />
                <Bone w="20%" h={13} />
                <Bone w="14%" h={13} />
                <Bone
                  w={84}
                  h={26}
                  r="full"
                  style={{ marginInlineStart: "auto" }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </SkeletonPage>
  );
}
