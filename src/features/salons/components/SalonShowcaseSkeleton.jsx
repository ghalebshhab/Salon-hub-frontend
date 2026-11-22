import { Bone } from "../../../shared/components/skeleton/Bone.jsx";

/** Salon cards while the list loads: same card, image box and text lines. */
export default function SalonShowcaseSkeleton({ count = 3 }) {
  return (
    <div className="salon-showcase-grid">
      {Array.from({ length: count }, (_, index) => (
        <div className="salon-showcase-card skeleton-frame" key={index}>
          <div className="salon-showcase-image">
            <Bone h="100%" r="0" />
          </div>
          <div className="salon-showcase-body">
            <Bone w="62%" h={22} r="md" style={{ marginBottom: 14 }} />
            <Bone w="82%" h={13} style={{ marginBottom: 10 }} />
            <Bone w="48%" h={13} style={{ marginBottom: 20 }} />
            <span className="salon-showcase-footer">
              <Bone w={92} h={13} />
              <Bone w={18} h={18} r="full" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
