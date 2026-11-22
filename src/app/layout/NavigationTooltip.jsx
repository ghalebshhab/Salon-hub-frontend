import t from "../../shared/i18n/t.js";
export default function NavigationTooltip({ label, children }) {
  return (
    <span className="navigation-tooltip-wrap">
      {children}
      <span className="navigation-tooltip" role="tooltip">
        {t(label)}
      </span>
    </span>
  );
}
