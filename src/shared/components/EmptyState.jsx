import t from "../i18n/t.js";
function EmptyState({
  title = t("No data yet"),
  message = t("There is nothing to show here."),
}) {
  return (
    <div className="empty-state">
      <h3>{t(title)}</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
