const TEETH = [
  "M15.44 25.22L11.64 23.98",
  "M18.71 20.72L16.36 17.48",
  "M24 19V15",
  "M29.29 20.72L31.64 17.48",
  "M32.56 25.22L36.36 23.98",
];

/**
 * Lamsa's mark: a speech bubble holding the Salonhub comb arc, with a gold
 * spark where the brand mark has its hub: the "touch" in Lamsa (لمسة).
 *
 * tone="color" fills the bubble with the brand plum (launcher, avatars);
 * tone="mono" draws it in currentColor, like the line icons in menus.
 * animated makes the mark feel alive: the spark twinkles, the comb teeth
 * light up one by one like a thought, and the bubble floats. The motion
 * stops for people who ask for reduced motion.
 */
export default function LamsaMark({
  tone = "color",
  className = "",
  title,
  animated = false,
}) {
  const mono = tone === "mono";
  const ink = mono ? "currentColor" : "var(--lamsa-ink, var(--on-primary))";
  const classes = ["lamsa-mark", animated && "is-animated", className]
    .filter(Boolean)
    .join(" ");
  return (
    <svg
      className={classes}
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <g className="lamsa-mark-body">
        <path
          d="M11 5h26a7 7 0 0 1 7 7v17a7 7 0 0 1-7 7H21l-8.5 7.2a.8.8 0 0 1-1.3-.6V36H11a7 7 0 0 1-7-7V12a7 7 0 0 1 7-7z"
          fill={mono ? "none" : "var(--lamsa-bubble, var(--primary))"}
          stroke={mono ? "currentColor" : "none"}
          strokeWidth={mono ? 2.6 : 0}
          strokeLinejoin="round"
        />
        <g
          fill="none"
          stroke={ink}
          strokeLinecap="round"
          strokeWidth={mono ? 2.4 : 2.6}
        >
          <path d="M15 28a9 9 0 0 1 18 0" />
          {TEETH.map((d, index) => (
            <path
              key={d}
              d={d}
              className="lamsa-mark-tooth"
              style={{ "--tooth": index }}
            />
          ))}
        </g>
        <path
          className="lamsa-mark-spark"
          d="M24 23.2q.7 4.1 4.8 4.8-4.1.7-4.8 4.8-.7-4.1-4.8-4.8 4.1-.7 4.8-4.8z"
          fill={mono ? "currentColor" : "var(--lamsa-spark, var(--accent))"}
        />
      </g>
    </svg>
  );
}
