export default function MobileMenuButton({ open, onToggle }) {
  return (
    <button
      className={open ? "mobile-menu-button open" : "mobile-menu-button"}
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      aria-controls="primary-navigation"
    >
      <span className="hamburger-line" />
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  );
}
