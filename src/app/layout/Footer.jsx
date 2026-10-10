import { Link } from "react-router-dom";
import BrandLogo from "../../shared/components/BrandLogo.jsx";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-brand" aria-label="SalonHub home">
          <BrandLogo showTagline />
        </Link>
        <p>© 2026 SalonHub. Connecting salons and professionals in Jordan.</p>
      </div>
    </footer>
  );
}

export default Footer;
