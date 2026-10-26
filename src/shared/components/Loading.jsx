import BrandedLoadingOverlay from "./BrandedLoadingOverlay.jsx";

function Loading({ message = "Preparing your experience…" }) {
  return (
    <BrandedLoadingOverlay
      visible
      message={message}
      variant="navigation"
      className="loading route-loading-overlay"
    />
  );
}

export default Loading;
