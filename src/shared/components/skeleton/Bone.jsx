import t from "../../i18n/t.js";

/**
 * Skeleton building blocks. A page skeleton reuses the real page's layout
 * classes (so the grid, spacing and cards match exactly) and puts a Bone
 * where text, an image or a control will appear.
 */

const RADIUS = {
  xs: "4px",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "var(--radius-full)",
};

/** One shimmering placeholder. `w` and `h` take any CSS length. */
export function Bone({ w = "100%", h = 12, r = "sm", className = "", style }) {
  return (
    <span
      className={`skeleton-block${className ? ` ${className}` : ""}`}
      style={{
        width: w,
        height: h,
        borderRadius: RADIUS[r] ?? r,
        ...style,
      }}
    />
  );
}

/** A paragraph: full lines, then a shorter last line. */
export function BoneLines({ count = 2, h = 12, gap = 8, last = "62%" }) {
  return (
    <span className="skeleton-lines" style={{ gap }}>
      {Array.from({ length: count }, (_, index) => (
        <Bone key={index} h={h} w={index === count - 1 ? last : "100%"} />
      ))}
    </span>
  );
}

/**
 * The outer element of a page skeleton, with the page's real classes. The
 * shapes inside are hidden from screen readers; a status line next to it
 * tells them the page is loading. The children sit directly in the element,
 * so the page's child selectors (`.page > .section`) still match.
 */
export function SkeletonPage({
  as: Tag = "div",
  className = "",
  label,
  children,
}) {
  return (
    <>
      <span className="sr-only" role="status">
        {label ?? t("Loading…")}
      </span>
      <Tag
        className={`skeleton-page${className ? ` ${className}` : ""}`}
        aria-hidden="true"
      >
        {children}
      </Tag>
    </>
  );
}

/**
 * The usual page heading: a small label, the title and one line of text.
 * Put it inside the page's real header class. With `copy` (an entry of
 * PAGE_HEADS) it renders the real tags and text as shimmer bars, so the
 * sizes and line wraps match the page exactly; without it, plain bones.
 */
export function HeadBones({
  copy,
  bare = false,
  className,
  eyebrowAs: Eyebrow = "span",
  eyebrowClass = "eyebrow",
  textClass,
  title = "min(360px, 70%)",
  text = "min(480px, 90%)",
}) {
  if (copy) {
    const parts = (
      <>
        {copy.eyebrow && (
          <Eyebrow className={eyebrowClass}>
            <TextBone>{t(copy.eyebrow)}</TextBone>
          </Eyebrow>
        )}
        <h1>
          <TextBone>
            {t(copy.title)}
            {copy.titleEm && (
              <>
                {" "}
                <em>{t(copy.titleEm)}</em>
              </>
            )}
          </TextBone>
        </h1>
        {copy.text && (
          <p className={textClass}>
            <TextBone>
              {t(copy.text)}
              {copy.textAfter}
            </TextBone>
          </p>
        )}
      </>
    );
    // `bare`: the real page puts these tags straight in its header.
    return bare ? parts : <div className={className}>{parts}</div>;
  }
  return (
    <div className="skeleton-head">
      <Bone w={104} h={11} />
      <Bone w={title} h={36} r="md" />
      {text && <Bone w={text} h={14} />}
    </div>
  );
}

/**
 * Fixed text (a page title, a label) as shimmer bars. Put it inside the real
 * element (h1, p…), so the bars wrap and space exactly like the real text.
 * `as` changes the tag when the page styles every span in that element.
 */
export function TextBone({ as: Tag = "span", children }) {
  return <Tag className="skeleton-text">{children}</Tag>;
}

/**
 * One line of text with unknown content: it takes the real line height
 * (`lh`) and shows a bar of the text's height (`h`) in its middle.
 */
export function LineBone({ lh, w = "100%", h = 12, r, className = "" }) {
  return (
    <span
      className={`skeleton-line${className ? ` ${className}` : ""}`}
      style={{ height: lh }}
    >
      <Bone w={w} h={h} r={r} />
    </span>
  );
}
