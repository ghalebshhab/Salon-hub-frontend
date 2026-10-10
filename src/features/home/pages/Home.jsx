import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleUserRound,
  FileUser,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import BarberAnimation from "../../../shared/components/BarberAnimation.jsx";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import SalonShowcase from "../../salons/components/SalonShowcase.jsx";

const platformFeatures = [
  {
    icon: Building2,
    title: "Verified salon profiles",
    text: "Browse active salons, working hours, location, team capacity, and direct contact details.",
  },
  {
    icon: FileUser,
    title: "Professional career profiles",
    text: "Save your experience, skills, preferred locations, resume, portfolio, and professional bio once.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Focused hiring posts",
    text: "Explore openings with required skills, age range, location, experience, positions, and closing date.",
  },
  {
    icon: Sparkles,
    title: "Candidate matching",
    text: "Applications include a match score, matched skills, extra strengths, and missing requirements.",
  },
  {
    icon: UserCheck,
    title: "Application decisions",
    text: "Owners review candidates in one place and accept or reject each request with clear status updates.",
  },
  {
    icon: ShieldCheck,
    title: "Protected owner tools",
    text: "Authenticated owners manage their salon and hiring activity through a dedicated dashboard.",
  },
];

const journeys = [
  {
    number: "01",
    icon: CircleUserRound,
    title: "Create your account",
    text: "Register with your contact details and sign in securely to unlock career and owner tools.",
  },
  {
    number: "02",
    icon: FileUser,
    title: "Build your profile",
    text: "Professionals complete one career profile that powers every future application.",
  },
  {
    number: "03",
    icon: Search,
    title: "Discover the right place",
    text: "Browse approved salons or search active hiring posts that match your goals.",
  },
  {
    number: "04",
    icon: MessageSquareText,
    title: "Connect and decide",
    text: "Apply with a personal note while salon owners compare applicants and make a decision.",
  },
];

const ownerSteps = [
  "Submit a complete salon profile for administrator review.",
  "Publish detailed openings after the salon is approved.",
  "Review candidate profiles, skills, resumes, and match results.",
  "Accept the best applicant or provide a clear rejection reason.",
];

const faqs = [
  {
    question: "Who is SalonHub for?",
    answer:
      "SalonHub serves salon owners and beauty professionals in Jordan. Visitors can also browse approved salon profiles without creating an account.",
  },
  {
    question: "How does a salon appear publicly?",
    answer:
      "An owner submits a salon profile. After administrator approval, it appears in the active salon directory with its contact details and working hours.",
  },
  {
    question: "What is included in a career profile?",
    answer:
      "A profile can include date of birth, experience, skills, preferred work locations, resume, portfolio, and a professional introduction.",
  },
  {
    question: "How are applications reviewed?",
    answer:
      "Owners see the candidate's profile, application note, match score, matched skills, and any missing requirements before accepting or rejecting the application.",
  },
];

function Home() {
  return (
    <div className="modern-home-page">
      <section className="home-hero-section">
        <div className="home-orb home-orb-one" />
        <div className="home-orb home-orb-two" />
        <div className="container home-hero-grid">
          <ScrollReveal className="home-hero-content">
            <div className="home-hero-badge">
              <Sparkles size={16} />
              Built for Jordan's salon community
            </div>
            <h1>Where great salons meet the right talent.</h1>
            <p>
              Discover approved salons, present your professional story, find
              relevant openings, and manage hiring from one thoughtful platform.
            </p>
            <div className="home-hero-actions">
              <Link className="btn btn-primary" to="/register">
                <UserPlus size={18} />
                Join SalonHub
              </Link>
              <Link className="btn btn-secondary" to="/hiring-posts">
                <Search size={18} />
                Explore Opportunities
              </Link>
            </div>
            <div className="home-trust-row">
              <span>
                <BadgeCheck size={18} />
                Approved salons
              </span>
              <span>
                <ShieldCheck size={18} />
                Protected accounts
              </span>
              <span>
                <MapPin size={18} />
                Built for Jordan
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal className="home-hero-visual" delay={140}>
            <div className="home-visual-card">
              <BarberAnimation />
            </div>
            <div className="floating-home-card floating-card-one">
              <BriefcaseBusiness size={21} />
              <div>
                <strong>Smart hiring</strong>
                <span>Skills and experience matching</span>
              </div>
            </div>
            <div className="floating-home-card floating-card-two">
              <BadgeCheck size={21} />
              <div>
                <strong>Trusted profiles</strong>
                <span>Approved salon directory</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal as="section" className="container home-value-strip">
        <div>
          <strong>One profile</strong>
          <span>Apply to multiple opportunities</span>
        </div>
        <div>
          <strong>Clear requirements</strong>
          <span>Know what every salon needs</span>
        </div>
        <div>
          <strong>Better decisions</strong>
          <span>Review useful candidate details</span>
        </div>
        <div>
          <strong>Direct connection</strong>
          <span>Reach salons through verified details</span>
        </div>
      </ScrollReveal>

      <section className="container section home-about-section">
        <ScrollReveal className="home-section-intro">
          <span className="eyebrow">What SalonHub does</span>
          <h2>One clear place for salon discovery and professional hiring.</h2>
          <p>
            SalonHub brings the complete supported workflow together. Salon
            owners create a trusted presence and grow their teams. Professionals
            build a reusable career profile and apply to openings that fit their
            experience.
          </p>
        </ScrollReveal>
        <div className="modern-features-grid">
          {platformFeatures.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal
              className="modern-feature-card"
              delay={(index % 3) * 90}
              key={title}
            >
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="home-journey-section">
        <div className="container section">
          <ScrollReveal className="modern-section-header centered">
            <span className="eyebrow">Your journey</span>
            <h2>From first visit to the right connection.</h2>
            <p>
              Each step is designed to keep the experience simple, useful, and
              transparent.
            </p>
          </ScrollReveal>
          <div className="home-steps-grid">
            {journeys.map(({ number, icon: Icon, title, text }, index) => (
              <ScrollReveal
                className="home-step-card"
                delay={index * 90}
                key={number}
              >
                <span className="step-number">{number}</span>
                <span className="step-icon">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <ScrollReveal className="modern-section-header">
          <div>
            <span className="eyebrow">Salon directory</span>
            <h2>Meet active salons on SalonHub.</h2>
            <p>
              Open a salon profile to see its location, working hours, capacity,
              description, and contact information.
            </p>
          </div>
          <Link className="section-header-link" to="/">
            <Search size={17} />
            Browse salons
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <SalonShowcase />
        </ScrollReveal>
      </section>

      <section className="container section">
        <ScrollReveal className="home-split-panel">
          <div className="home-split-copy">
            <span className="eyebrow">For salon owners</span>
            <h2>Turn hiring into an organized workflow.</h2>
            <p>
              Create your public identity, explain each role clearly, and review
              every candidate with the context you need.
            </p>
            <ul>
              {ownerSteps.map((step) => (
                <li key={step}>
                  <CheckCircle2 size={19} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="home-inline-actions">
              <Link className="btn btn-primary" to="/owner/create-salon">
                <Building2 size={18} />
                Create Your Salon
              </Link>
              <Link className="home-text-link" to="/owner/dashboard">
                Open owner dashboard <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="home-workflow-card">
            <div className="workflow-card-head">
              <span>
                <Users size={21} />
              </span>
              <div>
                <strong>Candidate review</strong>
                <small>Everything important, together</small>
              </div>
            </div>
            <div className="workflow-profile">
              <span className="workflow-avatar">RA</span>
              <div>
                <strong>Rana Ahmad</strong>
                <small>Hair stylist · Amman</small>
              </div>
              <span className="workflow-score">92% match</span>
            </div>
            <div className="workflow-tags">
              <span>Hair styling</span>
              <span>Coloring</span>
              <span>4 years</span>
            </div>
            <div className="workflow-progress">
              <span />
              <span />
              <span />
            </div>
            <div className="workflow-actions">
              <span>Review profile</span>
              <strong>Accept candidate</strong>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="home-professional-section">
        <div className="container section">
          <ScrollReveal className="home-professional-card">
            <div className="home-professional-icon">
              <FileUser size={32} />
            </div>
            <div>
              <span className="eyebrow">For professionals</span>
              <h2>Your experience deserves a strong introduction.</h2>
              <p>
                Build your career profile once, keep your professional details
                consistent, and apply with a personal note when the right
                opening appears.
              </p>
            </div>
            <div className="home-professional-actions">
              <Link className="btn btn-primary" to="/profile/career">
                Build Career Profile
              </Link>
              <Link className="btn btn-secondary" to="/hiring-posts">
                View Hiring Posts
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="container section">
        <ScrollReveal className="modern-section-header centered">
          <span className="eyebrow">Common questions</span>
          <h2>Know how SalonHub works.</h2>
          <p>Quick answers about profiles, approval, and the hiring process.</p>
        </ScrollReveal>
        <div className="home-faq-grid">
          {faqs.map(({ question, answer }, index) => (
            <ScrollReveal
              className="home-faq-card"
              delay={(index % 2) * 90}
              key={question}
            >
              <h3>{question}</h3>
              <p>{answer}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <ScrollReveal className="home-owner-cta">
          <div>
            <span className="eyebrow">Ready to begin?</span>
            <h2>
              Build your presence. Find your people. Grow with confidence.
            </h2>
            <p>
              Create your free SalonHub account and choose the path that fits
              you.
            </p>
          </div>
          <div className="home-owner-actions">
            <Link className="btn btn-primary" to="/register">
              <UserPlus size={18} />
              Create Account
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Sign In <ArrowRight size={17} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

export default Home;
