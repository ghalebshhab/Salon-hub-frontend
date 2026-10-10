import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Image,
  Scissors,
  Search,
  Sparkles,
  Star,
  Users,
  UserPlus,
  Building2,
  ArrowRight,
  Clock,
} from "lucide-react";

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

            <h1>
              Discover salons, book your style, and connect with real salon
              teams.
            </h1>

            <p>
              SalonHub helps customers explore salons, view real work, book
              appointments, and helps owners manage services, teams, hiring, and
              bookings in one place.
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

            <div className="home-search-preview">
              <Search size={19} />
              <span>Search salons by city, service, team, or style...</span>
              <Link to="/" className="home-search-button">
                Explore
              </Link>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-visual-card">
              <BarberAnimation />
            </div>

            <div className="floating-home-card floating-card-one">
              <CalendarCheck size={20} />
              <div>
                <strong>Easy Booking</strong>
                <span>Request appointments fast</span>
              </div>
            </div>

            <div className="floating-home-card floating-card-two">
              <Star size={20} fill="currentColor" />
              <div>
                <strong>Trusted Reviews</strong>
                <span>See customer feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-stats-section">
        <div className="home-stat">
          <Scissors size={24} />
          <strong>Salons</strong>
          <span>Explore profiles and services</span>
        </div>

        <div className="home-stat">
          <CalendarCheck size={24} />
          <strong>Bookings</strong>
          <span>Send appointment requests</span>
        </div>

        <div className="home-stat">
          <Users size={24} />
          <strong>Teams</strong>
          <span>Meet owners and employees</span>
        </div>

        <div className="home-stat">
          <Image size={24} />
          <strong>Media</strong>
          <span>View real salon work</span>
        </div>
      </section>

      <section className="container section">
        <div className="modern-section-header">
          <div>
            <span className="eyebrow">Explore salons</span>
            <h2>Discover salon work</h2>
            <p>
              Browse salons, view their services, check their teams, and open
              their profile before booking.
            </p>
          </div>

          <Link className="section-header-link" to="/">
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        <SalonShowcase />
      </section>

      <section className="container section">
        <div className="modern-section-header centered">
          <span className="eyebrow">Simple flow</span>
          <h2>How SalonHub works</h2>
          <p>A clean flow for both customers and salon owners.</p>
        </div>

        <div className="home-steps-grid">
          <div className="home-step-card">
            <div className="step-number">01</div>
            <div className="step-icon">
              <Search size={24} />
            </div>
            <h3>Explore</h3>
            <p>Customers browse salons, services, teams, media, and reviews.</p>
          </div>

          <div className="home-step-card">
            <div className="step-number">02</div>
            <div className="step-icon">
              <CalendarCheck size={24} />
            </div>
            <h3>Book</h3>
            <p>Customers choose services and send an appointment request.</p>
          </div>

          <div className="home-step-card">
            <div className="step-number">03</div>
            <div className="step-icon">
              <Clock size={24} />
            </div>
            <h3>Confirm</h3>
            <p>Salon owners accept, reject, or suggest another time.</p>
          </div>

          <div className="home-step-card">
            <div className="step-number">04</div>
            <div className="step-icon">
              <Star size={24} />
            </div>
            <h3>Review</h3>
            <p>After completion, customers share reviews and ratings.</p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="modern-section-header centered">
          <span className="eyebrow">Platform power</span>
          <h2>Everything a salon needs</h2>
          <p>
            SalonHub is not only a booking app. It is a small management system
            for salon profiles, teams, services, media, and hiring.
          </p>
        </div>

        <div className="modern-features-grid">
          <div className="modern-feature-card">
            <Scissors />
            <h3>Salon Profiles</h3>
            <p>
              Display salon information, address, contact, owner, gallery, and
              team.
            </p>
          </div>

          <div className="modern-feature-card">
            <CalendarCheck />
            <h3>Appointments</h3>
            <p>
              Customers can request bookings and owners manage their status.
            </p>
          </div>

          <div className="modern-feature-card">
            <Users />
            <h3>Employee Invites</h3>
            <p>Owners invite employees by email and link them automatically.</p>
          </div>

          <div className="modern-feature-card">
            <Image />
            <h3>Media Posts</h3>
            <p>Salons post photos and videos to show real work and style.</p>
          </div>

          <div className="modern-feature-card">
            <UserPlus />
            <h3>Hiring Posts</h3>
            <p>Owners publish hiring posts and manage team growth.</p>
          </div>

          <div className="modern-feature-card">
            <Star />
            <h3>Reviews</h3>
            <p>Completed bookings can turn into trusted customer reviews.</p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="home-owner-cta">
          <div>
            <span className="eyebrow">For salon owners</span>
            <h2>Build your salon presence and manage your team beautifully.</h2>
            <p>
              Create your salon, add services, invite employees, post media,
              publish hiring posts, and manage bookings from one dashboard.
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
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
