import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="container section">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
