import BrandLogo from "./BrandLogo.jsx";
import t from "../i18n/t.js";

function StartupSplash() {
  return (
    <div
      className="startup-splash"
      role="status"
      aria-label={t("SalonHub is loading")}
    >
      <BrandLogo />
    </div>
  );
}

export default StartupSplash;
