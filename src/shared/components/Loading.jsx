import BrandedLoadingOverlay from "./BrandedLoadingOverlay.jsx";
import t from "../i18n/t.js";

function Loading({ message = t("Preparing your experience…") }) {
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
