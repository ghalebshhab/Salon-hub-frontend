import {
  Bone,
  SkeletonPage,
} from "../../../shared/components/skeleton/Bone.jsx";

/** The assistant page: identity bar, the welcome with its cards, composer. */
export default function AssistantPageSkeleton() {
  return (
    <SkeletonPage className="lamsa-page container">
      <section className="lamsa-stage">
        <header className="lamsa-stage-bar">
          <Bone w={44} h={44} r="full" />
          <div className="lamsa-stage-title skeleton-head" style={{ gap: 8 }}>
            <Bone w={120} h={20} r="md" />
            <Bone w={170} h={11} />
          </div>
        </header>
        <div className="lamsa-conversation is-page">
          <div className="lamsa-scroll">
            <div className="lamsa-hero">
              <Bone w={96} h={96} r="full" />
              <Bone
                w="min(420px, 80%)"
                h={38}
                r="md"
                style={{ margin: "20px auto 12px" }}
              />
              <Bone
                w="min(300px, 60%)"
                h={30}
                r="md"
                style={{ marginInline: "auto" }}
              />
              <Bone
                w="min(560px, 90%)"
                h={14}
                style={{ margin: "18px auto 0" }}
              />
              <ul className="lamsa-capabilities">
                {[0, 1, 2, 3].map((card) => (
                  <li key={card}>
                    <span className="lamsa-capability skeleton-frame">
                      <Bone w={40} h={40} r="md" />
                      <span
                        className="lamsa-capability-text"
                        style={{ display: "grid", gap: 8 }}
                      >
                        <Bone w="60%" h={14} />
                        <Bone w="88%" h={11} />
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lamsa-composer skeleton-frame">
            <Bone h={22} w="70%" />
            <Bone
              w={44}
              h={44}
              r="full"
              style={{ marginInlineStart: "auto" }}
            />
          </div>
        </div>
      </section>
    </SkeletonPage>
  );
}
