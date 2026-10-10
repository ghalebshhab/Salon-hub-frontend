import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Scissors,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import BarberAnimation from "../../../shared/components/BarberAnimation.jsx";
import SalonShowcase from "../../salons/components/SalonShowcase.jsx";

function Home() {
  return (
    <div className="modern-home-page">
      <section className="home-hero-section">
        <div className="container home-hero-grid">
          <div className="home-hero-content">
            <div className="home-hero-badge">
              <Sparkles size={16} />
              Salon community in Jordan
            </div>
            <h1>Discover salons and find your next opportunity.</h1>
            <p>
              SalonHub connects approved salons, salon owners, and professionals
              through trusted profiles and hiring posts.
            </p>
            <div className="home-hero-actions">
              <Link className="btn btn-primary" to="/hiring-posts">
                <Users size={18} />
                View Hiring Posts
              </Link>
              <Link className="btn btn-secondary" to="/register">
                <UserPlus size={18} />
                Create Account
              </Link>
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="home-visual-card">
              <BarberAnimation />
            </div>
          </div>
        </div>
      </section>
      <section className="container home-stats-section">
        <div className="home-stat">
          <Scissors size={24} />
          <strong>Salon Profiles</strong>
          <span>Browse approved salons</span>
        </div>
        <div className="home-stat">
          <BriefcaseBusiness size={24} />
          <strong>Hiring Posts</strong>
          <span>Find current opportunities</span>
        </div>
        <div className="home-stat">
          <Users size={24} />
          <strong>Career Profiles</strong>
          <span>Present your experience and skills</span>
        </div>
        <div className="home-stat">
          <Building2 size={24} />
          <strong>Owner Tools</strong>
          <span>Manage salon hiring</span>
        </div>
      </section>
      <section className="container section">
        <div className="modern-section-header">
          <div>
            <span className="eyebrow">Explore salons</span>
            <h2>Approved salon profiles</h2>
            <p>Browse active salons and contact them directly.</p>
          </div>
          <Link className="section-header-link" to="/">
            <Search size={17} />
            Explore
          </Link>
        </div>
        <SalonShowcase />
      </section>
      <section className="container section">
        <div className="home-owner-cta">
          <div>
            <span className="eyebrow">For salon owners</span>
            <h2>Build your salon presence and grow your team.</h2>
            <p>
              Create a salon profile, publish hiring posts, and review
              candidates from one dashboard.
            </p>
          </div>
          <div className="home-owner-actions">
            <Link className="btn btn-primary" to="/owner/dashboard">
              <Building2 size={18} />
              Owner Dashboard
            </Link>
            <Link className="btn btn-secondary" to="/owner/create-salon">
              <Scissors size={18} />
              Create Salon
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
