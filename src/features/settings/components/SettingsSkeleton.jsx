import {
  Bone,
  HeadBones,
  LineBone,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

/** The first two setting groups, with their real titles and intros. */
const SECTIONS = [
  {
    title: "Language",
    intro:
      "The menus and pages change at once. Some pages are still in English while we translate them.",
  },
  {
    title: "Appearance",
    intro:
      "Pick light or dark. You can also switch it from the moon and sun button in the header.",
  },
];

function SectionBones({ title, intro }) {
  return (
    <section className="st-section skeleton-frame">
      <header className="st-section-head">
        <span className="st-section-icon">
          <Bone w={18} h={18} r="xs" />
        </span>
        <div>
          <h2>
            <TextBone>{t(title)}</TextBone>
          </h2>
          <p>
            <TextBone>{t(intro)}</TextBone>
          </p>
        </div>
      </header>
      <div className="st-choices">
        {[0, 1].map((choice) => (
          <span className="st-choice" key={choice}>
            <Bone w={40} h={40} r="lg" />
            <span className="st-choice-text">
              <LineBone lh={27.2} w="56%" h={15} />
              <LineBone lh={23.8} w="80%" h={11} />
            </span>
            <Bone w={20} h={20} r="full" />
          </span>
        ))}
      </div>
    </section>
  );
}

/** The settings page: hero, section links on the side, setting groups. */
export default function SettingsSkeleton() {
  return (
    <SkeletonPage className="st-page">
      <header className="st-hero">
        <HeadBones
          bare
          copy={PAGE_HEADS.settings}
          eyebrowAs="p"
          eyebrowClass="st-eyebrow"
        />
      </header>
      <div className="st-layout">
        <nav className="st-nav">
          {[96, 110, 90, 104, 80].map((width, index) => (
            <a key={index} style={{ pointerEvents: "none" }}>
              <Bone w={16} h={16} r="xs" />
              <Bone w={width} h={13} />
            </a>
          ))}
        </nav>
        <div className="st-content">
          {SECTIONS.map((section) => (
            <SectionBones key={section.title} {...section} />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
