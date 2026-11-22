import {
  Bone,
  HeadBones,
  LineBone,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** Notification rows while the list loads. */
export function NotificationRowsBones({ count = 5 }) {
  return (
    <div className="notifications-page-list">
      {Array.from({ length: count }, (_, row) => (
        <div className="notifications-page-item is-read" key={row}>
          <Bone w={8} h={8} r="full" />
          <span className="notifications-page-item-copy">
            <span className="notifications-page-item-heading">
              <LineBone lh={24} w="30%" h={14} />
              <LineBone lh={18} w={100} h={11} />
            </span>
            <LineBone lh={21} w="72%" h={12} />
            <LineBone lh={18} w={90} h={11} />
          </span>
          <Bone w={17} h={17} r="full" />
        </div>
      ))}
    </div>
  );
}

/** The notifications page: header with icon and button, then rows. */
export default function NotificationsSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="notifications-page container"
      label={t("Loading your notifications…")}
    >
      <header className="notifications-page-header">
        <div className="notifications-page-title">
          <Bone w={48} h={48} r="lg" />
          <HeadBones
            copy={PAGE_HEADS.notifications}
            eyebrowAs="p"
            eyebrowClass="notifications-eyebrow"
          />
        </div>
        <Bone w={160} h={42} r="full" />
      </header>
      <NotificationRowsBones />
    </SkeletonPage>
  );
}
