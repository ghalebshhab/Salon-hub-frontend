import {
  Bone,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import SalonShowcaseSkeleton from "../../salons/components/SalonShowcaseSkeleton.jsx";

/** An icon's place: a small bone of the icon's size. */
function IconBone({ size }) {
  return <Bone w={size} h={size} r="xs" style={{ display: "inline-block" }} />;
}

/**
 * The home hero and the salon section while the page code loads. The hero
 * has no data, so it uses the real tags and text as shimmer bars: every line
 * has the real size and wraps the same way. Only the salon cards are bones.
 */
export default function HomeSkeleton() {
  return (
    <SkeletonPage className="editorial-home">
      <section className="editorial-hero">
        <div className="container editorial-hero-grid">
          <div className="editorial-hero-copy">
            <span className="editorial-eyebrow">
              <IconBone size={15} />{" "}
              <TextBone>{t("Beauty, business, and opportunity")}</TextBone>
            </span>
            <h1>
              <TextBone>
                {t("Your next great")}
                <br />
                <em>{t("salon experience")}</em> {t("starts here.")}
              </TextBone>
            </h1>
            <p>
              <TextBone>
                {t(
                  "Discover trusted salons, book with clarity, build your career, and grow your team through one considered platform made for Jordan's beauty community.",
                )}
              </TextBone>
            </p>
            <div className="editorial-hero-actions">
              <span className="btn btn-primary skeleton-control">
                {t("Get started")} <IconBone size={17} />
              </span>
              <span className="btn btn-secondary skeleton-control">
                {t("Explore careers")}
              </span>
            </div>
            <div className="editorial-trust-row">
              {["Approved salons", "Protected accounts", "Made for Jordan"].map(
                (label) => (
                  <span key={label}>
                    <IconBone size={17} /> <TextBone>{t(label)}</TextBone>
                  </span>
                ),
              )}
            </div>
            <span className="editorial-scroll-cue">
              <TextBone>{t("Scroll to explore")}</TextBone>
              <span>
                <IconBone size={15} />
              </span>
            </span>
          </div>

          <div className="editorial-hero-aside">
            <div className="editorial-appointment-card">
              <div className="editorial-card-heading">
                <div>
                  <span className="editorial-eyebrow">
                    <TextBone>{t("A simpler visit")}</TextBone>
                  </span>
                  <h2>
                    <TextBone>{t("Everything stays clear.")}</TextBone>
                  </h2>
                </div>
                <span className="editorial-icon-tile skeleton-control">
                  <IconBone size={22} />
                </span>
              </div>
              {[
                ["Appointment request", "Pending"],
                ["Qualified employee", "Matched"],
              ].map(([label, value]) => (
                <div className="editorial-appointment-line" key={label}>
                  <span>
                    <IconBone size={17} /> <TextBone>{t(label)}</TextBone>
                  </span>
                  <strong>
                    <TextBone>{t(value)}</TextBone>
                  </strong>
                </div>
              ))}
              <div className="editorial-progress skeleton-control">
                <span />
              </div>
              <p>
                <TextBone>
                  {t(
                    "From service selection to the salon's decision, every step is easy to follow.",
                  )}
                </TextBone>
              </p>
            </div>
            <div className="editorial-mini-stats">
              {[
                ["For customers", "Book", "with confidence"],
                ["For professionals", "Grow", "with the right team"],
              ].map(([label, value, note]) => (
                <div key={label}>
                  <span>
                    <TextBone>{t(label)}</TextBone>
                  </span>
                  <strong>
                    <TextBone>{t(value)}</TextBone>
                  </strong>
                  <small>
                    <TextBone>{t(note)}</TextBone>
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section container">
        <div className="editorial-section-heading">
          <div>
            <span className="editorial-index">
              <TextBone>{t("01 / Discover")}</TextBone>
            </span>
            <h2>
              <TextBone>{t("Find your next favorite place.")}</TextBone>
            </h2>
            <p>
              <TextBone>
                {t(
                  "Browse active salons and open a profile for its location, working hours, team, services, reviews, and booking options.",
                )}
              </TextBone>
            </p>
          </div>
          <span className="editorial-heading-mark">
            <TextBone>{t("SH")}</TextBone>
          </span>
        </div>
        <SalonShowcaseSkeleton />
      </section>
    </SkeletonPage>
  );
}
