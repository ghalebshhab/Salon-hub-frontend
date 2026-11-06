export default function NavigationTooltip({ label, children }) {
  return (
    <span className="navigation-tooltip-wrap">
      {children}
      <span className="navigation-tooltip" role="tooltip">
        {label}
      </span>
    </span>
  );
}
