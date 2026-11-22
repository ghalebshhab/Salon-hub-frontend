import {
  Bone,
  LineBone,
  SkeletonPage,
  TextBone,
} from "../../../../shared/components/skeleton/Bone.jsx";
import t from "../../../../shared/i18n/t.js";

/** The four wizard steps (the same labels as BOOKING_STEPS). */
const STEPS = ["Service", "Professional", "Date & time", "Review"];

/** The summary lines shown before any choice is made. */
const FACTS = ["Professional", "Day", "Time"];

/** An icon's place: a small bone of the icon's size. */
function IconBone({ size }) {
  return <Bone w={size} h={size} r="xs" style={{ display: "inline-block" }} />;
}

/** One service tile of step one: check box, name, text, duration and price. */
function ServiceTileBones() {
  return (
    <div className="bk-service">
      <span className="bk-service-check" />
      <span className="bk-service-body" style={{ flex: 1 }}>
        <strong>
          <LineBone lh={27.2} w="62%" h={14} />
        </strong>
        <small>
          <LineBone lh={21.7} w="88%" h={11} />
        </small>
        <span className="bk-service-meta">
          <LineBone lh={23.8} w={64} h={11} />
          <b>
            <LineBone lh={27.2} w={52} h={14} />
          </b>
        </span>
      </span>
    </div>
  );
}

/**
 * The booking wizard while it loads, in the real tags: back link, title and
 * the four steps, step one with its service tiles, the action bar and the
 * visit summary. Fixed text shows as shimmer bars of the real size.
 */
export default function BookingWizardSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="container section bk-page"
      label={t("Loading booking")}
    >
      <header className="bk-header">
        <span className="bk-back">
          <IconBone size={16} />
          <LineBone lh={23.8} w={90} h={12} />
        </span>
        <h1>
          <TextBone>{t("Book an appointment")}</TextBone>
        </h1>
        <ol className="bk-stepper">
          {STEPS.map((label, index) => (
            <li
              className={`bk-step ${index === 0 ? "is-current" : "is-next"}`}
              key={label}
            >
              <button type="button" disabled tabIndex={-1}>
                <span className="bk-step-dot skeleton-control">
                  {index + 1}
                </span>
                <span className="bk-step-label">
                  <TextBone>{t(label)}</TextBone>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </header>
      <div className="bk-layout">
        <div className="bk-panel">
          <fieldset className="bk-fieldset" disabled>
            <legend className="bk-step-title">
              <span className="eyebrow">
                <TextBone>{t("Step 1")}</TextBone>
              </span>
              <TextBone>{t("What would you like to book?")}</TextBone>
              <small>
                <TextBone>
                  {t(
                    "Choose one or more services. You can combine them in one visit.",
                  )}
                </TextBone>
              </small>
            </legend>
            <div className="bk-service-grid">
              {[0, 1, 2, 3, 4, 5].map((tile) => (
                <ServiceTileBones key={tile} />
              ))}
            </div>
          </fieldset>
          <div className="bk-actions">
            <Bone w={90} h={46} r="full" />
          </div>
        </div>
        <aside className="bk-aside">
          <div className="bk-summary">
            <span className="eyebrow">
              <TextBone>{t("Your visit")}</TextBone>
            </span>
            <h2>
              <LineBone lh={31.2} w="70%" h={20} r="md" />
            </h2>
            <p className="bk-summary-city">
              <LineBone lh={22.1} w={60} h={11} />
            </p>
            <ul className="bk-summary-services">
              <li className="is-empty">
                <TextBone>{t("No service selected yet")}</TextBone>
              </li>
            </ul>
            <dl className="bk-summary-facts">
              {FACTS.map((label) => (
                <div key={label}>
                  <dt>
                    <IconBone size={15} /> <TextBone>{t(label)}</TextBone>
                  </dt>
                  <dd>
                    <TextBone>—</TextBone>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="bk-summary-total">
              <span>
                <TextBone>{t("Total")}</TextBone>
              </span>
              <strong>
                <LineBone lh={54.4} w={124} h={30} r="md" />
              </strong>
            </div>
            <p className="bk-summary-foot">
              <TextBone>
                {t("Pay at the salon. No charge to request.")}
              </TextBone>
            </p>
          </div>
        </aside>
      </div>
    </SkeletonPage>
  );
}
