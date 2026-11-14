// The SalonHub comb-hub symbol: comb teeth radiating from one gold hub.
// Drawn inline so it follows the light/dark theme colors.
export function BrandMark({ className = "brand-logo-mark" }) {
  return (
    <svg
      className={className}
      viewBox="0 10 64 44"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        className="brand-logo-mark-strokes"
      >
        <path d="M14 46a18 18 0 0 1 36 0" strokeWidth="6" />
        <path
          d="M11.33 38.48L2.87 35.4M19.38 27.98L14.22 20.61M32 24V15M44.62 27.98L49.78 20.61M52.67 38.48L61.13 35.4"
          strokeWidth="5"
        />
      </g>
      <circle className="brand-logo-mark-hub" cx="32" cy="46" r="4.5" />
    </svg>
  );
}

function BrandLogo({ showTagline = false }) {
  return (
    <span className="brand-logo">
      <BrandMark />
      <span className="brand-logo-copy">
        <span className="brand-logo-name">
          Salon<span>hub</span>
        </span>
        {showTagline && (
          <span className="brand-logo-tagline">Salons · People · Growth</span>
        )}
      </span>
    </span>
  );
}

export default BrandLogo;
