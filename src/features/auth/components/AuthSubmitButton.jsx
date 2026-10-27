export default function AuthSubmitButton({
  loading,
  loadingLabel = "Please wait…",
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
