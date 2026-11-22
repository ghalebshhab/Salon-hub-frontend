import {
  Bone,
  HeadBones,
  SkeletonPage,
  TextBone,
} from "../../../../shared/components/skeleton/Bone.jsx";
import t from "../../../../shared/i18n/t.js";
import MyBookingsSkeleton from "./MyBookingsSkeleton.jsx";
import { BOOKING_VIEWS } from "../../model/customerBookings.js";
import { PAGE_HEADS } from "../../../../shared/copy/pageHeads.js";

/** The whole "My bookings" page while its code loads. */
export default function MyBookingsPageSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section mb-page"
      label={t("Loading your bookings")}
    >
      <header className="mb-hero">
        <HeadBones copy={PAGE_HEADS.myBookings} />
        <Bone w={190} h={46} r="full" />
      </header>
      <div className="mb-tabs">
        {BOOKING_VIEWS.map((view, index) => (
          <span
            className={`mb-tab${index === 0 ? " is-active" : ""}`}
            key={view.key}
          >
            <TextBone>{t(view.label)}</TextBone>
            <span className="mb-tab-count">
              <TextBone>0</TextBone>
            </span>
          </span>
        ))}
      </div>
      <MyBookingsSkeleton />
    </SkeletonPage>
  );
}
