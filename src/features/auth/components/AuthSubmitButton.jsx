import t from "../../../shared/i18n/t.js";
export default function AuthSubmitButton({
  loading,
  loadingLabel = t("Please wait…"),
  disabled = false,
  children,
}) {
  return (
    <button
      className="btn btn-primary full-width auth-submit"
      type="submit"
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
