import {
  Bone,
  LineBone,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import StandardPageSkeleton, {
  BookingCardBones,
} from "../../../shared/components/skeleton/StandardPageSkeleton.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** The salon's bookings page: header card and a list of booking cards. */
export function SalonBookingsSkeleton() {
  return (
    <StandardPageSkeleton
      head={PAGE_HEADS.salonBookings}
      label={t("Loading salon bookings...")}
    >
      <div className="booking-list">
        {[0, 1, 2].map((card) => (
          <BookingCardBones key={card} />
        ))}
      </div>
    </StandardPageSkeleton>
  );
}

/**
 * One appointment card of the employee's agenda, in its real tags: the
 * customer header, the four info lines, and the services with one chip.
 */
function EmployeeCardBones() {
  return (
    <div className="employee-booking-card">
      <div className="employee-booking-header">
        <Bone w={54} h={54} r="lg" />
        <div>
          <h3>
            <LineBone lh={31.824} w={110} h={17} />
          </h3>
          <p>
            <LineBone lh={27.2} w={90} h={13} />
          </p>
        </div>
        <Bone w={64} h={27} r="full" />
      </div>
      <div className="booking-info-grid">
        {[0, 1, 2, 3].map((item) => (
          <p key={item}>
            <Bone w={16} h={16} r="xs" />
            <LineBone lh={27.2} w="60%" h={13} />
          </p>
        ))}
      </div>
      <div className="booking-services">
        <strong>
          <Bone w={16} h={16} r="xs" />
          <TextBone>{t("Services")}</TextBone>
        </strong>
        <div>
          <span className="service-chip">
            <LineBone lh={23.8} w={170} h={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** The employee's agenda: header card, then the "Today" group of cards. */
export function EmployeeBookingsSkeleton() {
  return (
    <StandardPageSkeleton
      className="employee-agenda"
      head={PAGE_HEADS.employeeBookings}
      label={t("Loading your appointments...")}
    >
      {[
        ["Today", 2],
        ["Upcoming", 1],
      ].map(([title, cards]) => (
        <section className="employee-agenda-group" key={title}>
          <h2>
            <TextBone as="mark">{t(title)}</TextBone>{" "}
            <span>
              <TextBone as="mark">0</TextBone>
            </span>
          </h2>
          <div className="employee-bookings-grid">
            {Array.from({ length: cards }, (_, card) => (
              <EmployeeCardBones key={card} />
            ))}
          </div>
        </section>
      ))}
    </StandardPageSkeleton>
  );
}
