import { ArrowRight, Check, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { ownerSteps } from "../content/homeContent.js";

export default function OwnerExperienceSection() {
  return (
    <section className="editorial-section container" id="owners">
      <ScrollReveal className="editorial-owner-panel">
        <div className="editorial-owner-copy">
          <span className="editorial-index">03 / For salon owners</span>
          <h2>A more considered way to run and grow your salon.</h2>
          <p>
            Build a trusted public presence, organize appointments, and make
            stronger hiring decisions without losing the human context.
          </p>
          <div className="editorial-check-list">
            {ownerSteps.map((step) => (
              <span key={step}>
                <Check size={16} /> {step}
              </span>
            ))}
          </div>
          <div className="editorial-inline-actions">
            <Link className="btn btn-primary" to="/owner/create-salon">
              Create your salon <ArrowRight size={17} />
            </Link>
            <Link className="editorial-text-link" to="/owner/dashboard">
              Open owner dashboard
            </Link>
          </div>
        </div>
        <div className="editorial-candidate-card">
          <div className="editorial-card-heading">
            <div>
              <span className="editorial-eyebrow">Candidate review</span>
              <h3>The strongest match, first.</h3>
            </div>
            <Users size={22} />
          </div>
          <div className="editorial-candidate">
            <span className="editorial-avatar">RA</span>
            <div>
              <strong>Rana Ahmad</strong>
              <small>Hair stylist · Amman</small>
            </div>
            <span className="editorial-match">92% match</span>
          </div>
          <div className="editorial-tags">
            <span>Hair styling</span>
            <span>Coloring</span>
            <span>4 years</span>
            <span>Resume</span>
          </div>
          <div className="editorial-ranking">
            <span />
            <span />
            <span />
          </div>
          <div className="editorial-candidate-footer">
            <span>Suggested candidate</span>
            <strong>Review application</strong>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
