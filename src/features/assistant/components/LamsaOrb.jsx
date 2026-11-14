import LamsaMark from "./LamsaMark.jsx";

/**
 * The assistant's avatar: a glossy plum orb with a gold glow that holds the
 * mark. It keeps the brand colors in light and dark themes, so the
 * assistant looks the same everywhere. `live` adds the turning AI ring.
 */
export default function LamsaOrb({
  size = "md",
  animated = false,
  live = false,
  className = "",
}) {
  const classes = ["lamsa-orb", `is-${size}`, live && "is-live", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} aria-hidden="true">
      <LamsaMark animated={animated} />
    </span>
  );
}
