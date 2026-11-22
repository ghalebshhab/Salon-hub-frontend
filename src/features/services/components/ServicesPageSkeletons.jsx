import { Bone, BoneLines } from "../../../shared/components/skeleton/Bone.jsx";
import StandardPageSkeleton, {
  FormCardBones,
} from "../../../shared/components/skeleton/StandardPageSkeleton.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** "Manage services": header with the add button, then service cards. */
export function SalonServicesSkeleton() {
  return (
    <StandardPageSkeleton
      action
      head={PAGE_HEADS.services}
      label={t("Loading services...")}
    >
      <div className="services-grid">
        {[0, 1, 2, 3, 4, 5].map((card) => (
          <div className="service-card skeleton-frame" key={card}>
            <div style={{ display: "grid", gap: 12 }}>
              <Bone w="58%" h={20} r="md" />
              <BoneLines count={2} h={12} last="70%" />
            </div>
            <div className="service-meta">
              <Bone w={64} h={26} r="full" />
              <Bone w={64} h={26} r="full" />
              <Bone w={60} h={26} r="full" />
            </div>
            <div className="service-actions">
              <Bone w={84} h={36} r="full" />
              <Bone w={96} h={36} r="full" />
            </div>
          </div>
        ))}
      </div>
    </StandardPageSkeleton>
  );
}

/** Add or edit one service: header, then the service form. */
export function ServiceFormSkeleton({ edit = false }) {
  return (
    <StandardPageSkeleton
      action
      head={edit ? PAGE_HEADS.editService : PAGE_HEADS.addService}
      label={t("Loading service...")}
    >
      <FormCardBones rows={edit ? [1, "area", 2, "check"] : [1, "area", 2]} />
    </StandardPageSkeleton>
  );
}
