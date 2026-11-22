import {
  Bone,
  LineBone,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";

/** A section heading in its real tags: the fixed text as shimmer bars. */
function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="sp-heading">
      <span className="sp-eyebrow">
        <TextBone>{t(eyebrow)}</TextBone>
      </span>
      <h2>
        {title ? (
          <TextBone>{t(title)}</TextBone>
        ) : (
          <LineBone lh={39.6} w="60%" h={28} r="md" />
        )}
      </h2>
      {intro && (
        <p>
          <TextBone>{t(intro)}</TextBone>
        </p>
      )}
    </div>
  );
}

/** One service tile of the menu: number, add button, name, text and price. */
function MenuItemBones({ index }) {
  return (
    <li className="menu-item is-pickable">
      <div className="menu-item-head">
        <span className="menu-item-no">
          <TextBone>{String(index + 1).padStart(2, "0")}</TextBone>
        </span>
        <span className="menu-item-toggle skeleton-control" />
      </div>
      <h3>
        <LineBone lh={22.5} w="70%" h={15} />
      </h3>
      <p className="menu-item-description">
        <LineBone lh={20.15} w="90%" h={11} />
      </p>
      <div className="menu-item-foot">
        <Bone w={81} h={26} r="full" />
        <strong className="menu-item-price">
          <LineBone lh={34} w={75} h={18} />
        </strong>
      </div>
    </li>
  );
}

/**
 * The salon page while it loads: cover, quote bar with actions, section tabs,
 * the services menu, and the booking card on the side.
 */
export default function SalonPageSkeleton() {
  return (
    <SkeletonPage
      as="section"
      className="sp"
      label={t("Loading salon profile")}
    >
      <div className="container sp-container">
        <header className="sh">
          <div className="sh-cover skeleton-cover">
            <Bone r="0" />
            <div className="sh-cover-content" style={{ position: "relative" }}>
              <span className="sh-badges">
                <Bone className="is-raised" w={93} h={22} r="full" />
              </span>
              {/* A stand-in name keeps the title's real size on every screen. */}
              <h1>
                <TextBone>{t("Salon name")}</TextBone>
              </h1>
              <div className="sh-facts">
                <Bone className="is-raised" w={211} h={36} r="full" />
                <Bone className="is-raised" w={79} h={36} r="full" />
                <Bone className="is-raised" w={95} h={36} r="full" />
              </div>
            </div>
          </div>
          <div className="sh-bar">
            <figure className="sh-note">
              <span className="sh-note-mark">
                <TextBone>&ldquo;</TextBone>
              </span>
              <blockquote className="sh-note-text">
                <p>
                  <LineBone lh={33.28} w="min(320px, 70%)" h={20} r="md" />
                </p>
              </blockquote>
              <figcaption className="sh-note-caption">
                <span>
                  <TextBone>{t("In the salon's words")}</TextBone>
                </span>
                <span>
                  <TextBone>{t("Read the story")}</TextBone>
                </span>
              </figcaption>
            </figure>
            <div className="sh-actions">
              <Bone w={147} h={51} r="full" />
              <Bone w={104} h={53} r="full" />
              <span className="sh-icon-button skeleton-control" />
              <span className="sh-icon-button skeleton-control" />
              <span className="sh-icon-button skeleton-control" />
            </div>
          </div>
        </header>

        <nav className="sn">
          <ul>
            {[78, 64, 70, 72, 56].map((width, index) => (
              <li key={index}>
                <a style={{ pointerEvents: "none" }}>
                  <Bone w={width} h={13} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sp-grid">
          <div className="sp-main">
            <section className="sp-section">
              <SectionHeading
                eyebrow="The menu"
                title="Services and prices"
                intro="Prices and times as the salon lists them. Pick what you need for one visit and book it in one step."
              />
              <div className="menu">
                <div className="menu-top">
                  <p className="menu-summary">
                    <LineBone lh={23.1} w={260} h={12} />
                  </p>
                </div>
                <div className="menu-tools">
                  <Bone h={44} r="full" />
                  <Bone w={176} h={44} r="full" />
                </div>
                <ul className="menu-list">
                  {[0, 1, 2, 3].map((item) => (
                    <MenuItemBones index={item} key={item} />
                  ))}
                </ul>
              </div>
            </section>
            <section className="sp-section">
              <SectionHeading eyebrow="Meet the team" />
            </section>
          </div>

          <div className="sp-aside">
            <div className="sb">
              <div className="sb-today">
                <div className="sb-today-row">
                  <Bone w={94} h={37} r="full" />
                  <span className="sb-today-hours">
                    <LineBone lh={22.1} w={119} h={12} />
                  </span>
                </div>
                <p className="sb-detail">
                  <LineBone lh={23.8} w="80%" h={12} />
                </p>
                <div className="sb-day">
                  <div className="sb-day-track skeleton-control" />
                  <div className="sb-day-scale">
                    {["12 AM", "12 PM", "12 AM"].map((label, index) => (
                      <span key={index}>
                        <TextBone>{t(label)}</TextBone>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sb-body">
                <Bone h={51} r="full" />
                <div className="sb-quick">
                  {["Call", "Directions"].map((label) => (
                    <span
                      className="sb-quick-item skeleton-control"
                      key={label}
                    >
                      <Bone w={18} h={18} />
                      <span>{t(label)}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="sb-map skeleton-control">
                <div className="map-embed is-static" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
