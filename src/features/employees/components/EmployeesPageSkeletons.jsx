import { Bone, BoneLines } from "../../../shared/components/skeleton/Bone.jsx";
import StandardPageSkeleton from "../../../shared/components/skeleton/StandardPageSkeleton.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** "Employees and schedules": header, then two columns of team cards. */
export function SalonTeamSkeleton() {
  return (
    <StandardPageSkeleton
      head={PAGE_HEADS.salonTeam}
      label={t("Loading your salon team…")}
    >
      <div className="employee-setup-grid">
        {[0, 1, 2, 3].map((card) => (
          <div className="employee-setup-card skeleton-frame" key={card}>
            <Bone w={56} h={56} r="full" />
            <div
              className="employee-setup-copy"
              style={{ display: "grid", gap: 10 }}
            >
              <Bone w="56%" h={18} r="md" />
              <Bone w="80%" h={12} />
              <Bone w="40%" h={12} />
            </div>
            <div className="employee-setup-actions">
              <Bone w={120} h={36} r="full" />
            </div>
          </div>
        ))}
      </div>
    </StandardPageSkeleton>
  );
}

/** Job applications from candidates: header, then application cards. */
export function ApplicationsReviewSkeleton() {
  return (
    <StandardPageSkeleton
      head={PAGE_HEADS.hiringApplications}
      label={t("Loading applications...")}
    >
      <div className="owner-employees-grid">
        {[0, 1, 2, 3].map((card) => (
          <div className="owner-employee-card skeleton-frame" key={card}>
            <div className="owner-employee-top">
              <div className="skeleton-head" style={{ gap: 8 }}>
                <Bone w="54%" h={18} r="md" />
                <Bone w="40%" h={12} />
              </div>
              <Bone w={80} h={26} r="full" />
            </div>
            <div className="owner-employee-info">
              <BoneLines count={4} h={12} gap={10} last="50%" />
            </div>
            <div className="service-actions">
              <Bone w={96} h={36} r="full" />
              <Bone w={90} h={36} r="full" />
            </div>
          </div>
        ))}
      </div>
    </StandardPageSkeleton>
  );
}

function SetupPanelHeading() {
  return (
    <div className="employee-setup-panel-heading">
      <Bone w={44} h={44} r="lg" />
      <div className="skeleton-head" style={{ gap: 8 }}>
        <Bone w="42%" h={22} r="md" />
        <Bone w="72%" h={12} />
      </div>
    </div>
  );
}

/** One employee's setup: services they do, then the weekly hours. */
export function EmployeeSetupSkeleton() {
  return (
    <StandardPageSkeleton
      className="employee-setup-page"
      label={t("Loading employee setup…")}
    >
      <section className="employee-setup-panel skeleton-frame">
        <SetupPanelHeading />
        <div className="employee-service-options">
          {[0, 1, 2, 3].map((item) => (
            <Bone key={item} h={54} r="lg" />
          ))}
        </div>
        <div className="employee-setup-actions">
          <Bone w={150} h={44} r="full" />
        </div>
      </section>
      <section className="employee-setup-panel skeleton-frame">
        <SetupPanelHeading />
        <div className="employee-week-grid">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div className="employee-day-row" key={day}>
              <Bone w={90} h={14} />
              <div style={{ display: "flex", gap: 10 }}>
                <Bone w={120} h={42} r="md" />
                <Bone w={120} h={42} r="md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </StandardPageSkeleton>
  );
}
