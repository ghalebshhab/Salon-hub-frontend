import BrandLogo from "./BrandLogo.jsx";

function Loading() {
  return (
    <div
      className="startup-splash route-loading-splash"
      role="status"
      aria-label="SalonHub is loading"
    >
      <BrandLogo />
    </div>
  );
}

export default Loading;
