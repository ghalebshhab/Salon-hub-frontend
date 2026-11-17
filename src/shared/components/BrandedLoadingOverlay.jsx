import { BrandMark } from "./BrandLogo.jsx";

export default function BrandedLoadingOverlay({
  visible,
  message = "Preparing your experience…",
  className = "",
  variant = "action",
}) {
  if (!visible) return null;

  return (
    <div
      className={`salon-loading-overlay salon-loading-${variant} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={message}
      aria-busy="true"
    >
      <div className="salon-loading-focus">
        <div className="salon-navigation-logo-stage" aria-hidden="true">
          <span className="salon-navigation-logo-ring" />
          <BrandMark className="brand-logo-mark salon-loading-logo" />
        </div>
        <div className="salon-loading-copy">
          <span>SalonHub</span>
          <strong>{message}</strong>
        </div>
        <div className="salon-loading-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}
