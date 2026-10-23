export default function AuthSubmitButton({ loading, children }) {
  return (
    <button
      className="btn btn-primary full-width auth-submit"
      type="submit"
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
