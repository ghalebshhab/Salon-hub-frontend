function BrandLogo({ showTagline = false }) {
  return (
    <span className="brand-logo">
      <img
        className="brand-logo-mark"
        src="/salonhub-mark.svg"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-logo-copy">
        <span className="brand-logo-name">
          Salon<span>Hub</span>
        </span>
        {showTagline && (
          <span className="brand-logo-tagline">Salons · People · Growth</span>
        )}
      </span>
    </span>
  );
}

export default BrandLogo;
