import { Bone, HeadBones, SkeletonPage } from "./Bone.jsx";

/**
 * Pages built as "container section" with the rounded "profile-header" card
 * on top (bookings, team, services). `head` is the page's PAGE_HEADS entry,
 * `action` adds the header button; the page body goes in `children`.
 */
export default function StandardPageSkeleton({
  className = "",
  label,
  head,
  action = false,
  children,
}) {
  return (
    <SkeletonPage
      as="section"
      className={`container section${className ? ` ${className}` : ""}`}
      label={label}
    >
      <div className="profile-header skeleton-frame">
        <HeadBones copy={head} />
        {action && <Bone w={170} h={46} r="full" />}
      </div>
      {children}
    </SkeletonPage>
  );
}

/** One booking card: header with status, the info grid, service chips. */
export function BookingCardBones({ employee = false, actions = true }) {
  const card = employee ? "employee-booking-card" : "booking-card";
  return (
    <div className={`${card} skeleton-frame`}>
      <div
        className={employee ? "employee-booking-header" : "booking-card-header"}
      >
        {employee && <Bone w={48} h={48} r="lg" />}
        <div className="skeleton-head" style={{ gap: 8 }}>
          <Bone w="44%" h={20} r="md" />
          <Bone w="30%" h={12} />
        </div>
        <Bone w={92} h={28} r="full" />
      </div>
      <div className="booking-info-grid">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} style={{ display: "grid", gap: 8 }}>
            <Bone w="50%" h={10} />
            <Bone w="78%" h={14} />
          </div>
        ))}
      </div>
      <div className="booking-services" style={{ display: "flex", gap: 8 }}>
        <Bone w={110} h={30} r="full" />
        <Bone w={86} h={30} r="full" />
      </div>
      {actions && (
        <div className="service-actions">
          <Bone w={120} h={38} r="full" />
          <Bone w={100} h={38} r="full" />
        </div>
      )}
    </div>
  );
}

function FieldBones({ tall = false }) {
  return (
    <div className="form-group">
      <Bone w={110} h={11} style={{ marginBottom: 10 }} />
      <Bone h={tall ? 110 : 48} r="12px" />
    </div>
  );
}

/**
 * A "form-card" form. `rows` lists each row: 1 = a field, 2 = two fields side
 * by side, "area" = a text area, "check" = a checkbox line.
 */
export function FormCardBones({ rows = [1, "area", 2], button = 170 }) {
  return (
    <div className="form-card skeleton-frame">
      {rows.map((row, index) => {
        if (row === 2)
          return (
            <div className="form-grid-two" key={index}>
              <FieldBones />
              <FieldBones />
            </div>
          );
        if (row === "check")
          return (
            <div className="checkbox-row" key={index} style={{ gap: 10 }}>
              <Bone w={18} h={18} r="xs" />
              <Bone w={160} h={12} />
            </div>
          );
        return <FieldBones key={index} tall={row === "area"} />;
      })}
      <Bone w={button} h={46} r="full" style={{ marginTop: 8 }} />
    </div>
  );
}
