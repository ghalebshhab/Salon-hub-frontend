export default function BrandedLoadingOverlay({
  visible,
  message = "Preparing your experience…",
  className = "",
  variant = "action",
}) {
  if (!visible) return null;

  const isNavigation = variant === "navigation";

  return (
    <div
      className={`salon-loading-overlay salon-loading-${variant} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={message}
      aria-busy="true"
    >
      <div className="salon-loading-focus">
        {isNavigation ? (
          <div className="salon-navigation-logo-stage" aria-hidden="true">
            <span className="salon-navigation-logo-ring" />
            <img src="/salonhub-mark.svg" alt="" />
          </div>
        ) : (
          <div className="salon-snip-stage" aria-hidden="true">
            <span className="salon-snip-ring" />
            <div className="salon-snip-scissors">
              <span className="salon-snip-blade salon-snip-blade-left" />
              <span className="salon-snip-blade salon-snip-blade-right" />
              <span className="salon-snip-pivot" />
              <span className="salon-snip-spark">✦</span>
            </div>
          </div>
        )}
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
