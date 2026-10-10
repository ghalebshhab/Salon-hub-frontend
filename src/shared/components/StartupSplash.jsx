import BrandLogo from "./BrandLogo.jsx";

function StartupSplash() {
  return (
    <div
      className="startup-splash"
      role="status"
      aria-label="SalonHub is loading"
    >
      <BrandLogo />
    </div>
  );
}

export default StartupSplash;
