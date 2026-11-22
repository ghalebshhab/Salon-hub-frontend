import {
  Bone,
  BoneLines,
  HeadBones,
  LineBone,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function PostBones() {
  return (
    <div className="community-feed-skeleton">
      <div className="community-skeleton-author">
        <span />
        <div>
          <i />
          <i />
        </div>
      </div>
      <i className="community-skeleton-line" />
      <i className="community-skeleton-line is-short" />
      <i className="community-skeleton-block" />
    </div>
  );
}

/** The community workspace: header, section tabs, feed and side cards. */
export function CommunitySkeleton() {
  return (
    <SkeletonPage
      as="main"
      className="community-page community-workspace-v2"
      label={t("Loading community posts")}
    >
      <div className="container">
        <header className="community-header">
          <HeadBones
            copy={PAGE_HEADS.community}
            className="community-header-copy"
            eyebrowClass="community-header-eyebrow"
          />
          <Bone w={150} h={46} r="full" />
        </header>
        <nav className="community-tabs">
          {[70, 82, 86, 90].map((width, index) => (
            <span className="community-tab" key={index}>
              <Bone w={width} h={14} />
            </span>
          ))}
        </nav>
        <div className="community-v2-layout">
          <div className="community-v2-main">
            <div className="community-feed">
              <header className="community-feed-heading">
                <div className="skeleton-head" style={{ gap: 8 }}>
                  <Bone w={90} h={10} />
                  <Bone w="40%" h={24} r="md" />
                </div>
                <Bone w={60} h={12} />
              </header>
              <div className="community-feed-skeletons">
                <PostBones />
                <PostBones />
              </div>
            </div>
          </div>
          <aside className="community-v2-aside">
            <section className="community-aside-card community-me">
              <div className="community-me-cover" />
              <div className="community-me-body">
                <Bone w={58} h={58} r="full" />
                <h2>
                  <LineBone lh={34} w={110} h={18} />
                </h2>
                <p>
                  <LineBone lh={22.1} w={80} h={11} />
                </p>
                <span className="community-me-link">
                  <TextBone>{t("View your profile")}</TextBone>
                </span>
              </div>
              <dl className="community-me-stats">
                {["Friends", "Following", "Requests"].map((label) => (
                  <div key={label}>
                    <dt>
                      <TextBone>{t(label)}</TextBone>
                    </dt>
                    <dd>
                      <LineBone lh={34} w={22} h={18} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="community-aside-card skeleton-frame">
              <Bone w="54%" h={16} r="md" style={{ marginBottom: 16 }} />
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <Bone w={40} h={40} r="full" />
                  <div style={{ flex: 1 }}>
                    <BoneLines count={2} h={11} last="50%" />
                  </div>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </SkeletonPage>
  );
}

/** A member's profile: cover, portrait and name, stats, about and side cards. */
export function CommunityProfileSkeleton() {
  return (
    <SkeletonPage
      as="main"
      className="community-profile-page"
      label={t("Opening community profile…")}
    >
      <div className="container community-profile-shell">
        <span className="community-profile-back">
          <Bone w={17} h={17} r="xs" />{" "}
          <TextBone>{t("Back to community")}</TextBone>
        </span>
        <header className="pf-hero">
          <div className="pf-cover">
            <span className="pf-cover-word">
              <LineBone lh={77.76} w="min(420px, 60%)" h={58} r="md" />
            </span>
          </div>
          <div className="pf-identity">
            <div className="pf-portrait">
              <Bone
                w="100%"
                h="100%"
                r="full"
                className="is-raised"
                style={{ border: "4px solid var(--card)" }}
              />
            </div>
            <div className="pf-title">
              <div className="pf-badges">
                <Bone w={110} h={26} r="full" />
              </div>
              <h1>
                <LineBone lh={49.92} w="min(300px, 80%)" h={34} r="md" />
              </h1>
              <p className="pf-handle">
                <LineBone lh={23.8} w={110} h={12} />
              </p>
              <p className="pf-role-line">
                <LineBone lh={23.8} w={180} h={12} />
              </p>
            </div>
            <div className="pf-actions">
              <Bone w={152} h={42} r="full" />
              <Bone w={121} h={42} r="full" />
            </div>
          </div>
          <dl className="pf-stats">
            {["Posts", "Friends", "Salons followed"].map((label) => (
              <div key={label}>
                <dt>
                  <TextBone>{t(label)}</TextBone>
                </dt>
                <dd>
                  <LineBone lh={30.6} w={14} h={18} />
                </dd>
              </div>
            ))}
          </dl>
        </header>
        <div className="community-profile-layout">
          <section className="community-profile-main-column">
            <article className="pf-about">
              <span className="community-card-kicker">
                <TextBone>{t("About")}</TextBone>
              </span>
              <h2>
                <LineBone lh={40.8} w="min(260px, 60%)" h={26} r="md" />
              </h2>
              <p className="pf-summary">
                <LineBone lh={28.8} w="90%" h={15} />
              </p>
              <ul className="pf-highlights">
                <li>
                  <span className="pf-highlight-icon">
                    <Bone w={17} h={17} r="xs" />
                  </span>
                  <strong>
                    <LineBone lh={23.8} w={120} h={13} />
                  </strong>
                  <small>
                    <LineBone lh={20.4} w={160} h={11} />
                  </small>
                </li>
              </ul>
            </article>
            <div className="community-profile-post-skeletons">
              {[0, 1].map((item) => (
                <div className="community-profile-post-skeleton" key={item}>
                  <span />
                  <i />
                  <i />
                  <b />
                </div>
              ))}
            </div>
          </section>
          <aside className="community-profile-sidebar pf-side">
            <section className="pf-card">
              <h2 className="community-card-kicker">
                <Bone w={14} h={14} r="xs" />{" "}
                <TextBone>{t("Specialties")}</TextBone>
              </h2>
              <p className="pf-muted">
                <LineBone lh={22.1} w="70%" h={11} />
              </p>
            </section>
          </aside>
        </div>
      </div>
    </SkeletonPage>
  );
}
