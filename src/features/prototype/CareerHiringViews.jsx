import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Send,
  Sparkles,
  UserCheck,
  UserRoundPlus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { EmptyPrototype, FeatureNote, ProfileSnapshot, SectionHeading, StatusPill } from "./PrototypePrimitives.jsx";
import { initialCareerProfile } from "./prototypeData.js";

export function CareersView({ posts, onApply }) {
  const sortedPosts = [...posts].sort((a, b) => b.matchScore - a.matchScore);
  return (
    <div className="prototype-view">
      <SectionHeading
        eyebrow="Candidate experience"
        title="Career opportunities"
        description="Jobs are ranked by profile fit. Suggested roles appear first, while missing requirements remain visible and explained."
      />
      <ProfileSnapshot profile={initialCareerProfile} />
      <FeatureNote>Resume upload stays optional, but an uploaded résumé improves the recommendation score.</FeatureNote>
      <div className="prototype-job-list">
        {sortedPosts.map((post, index) => (
          <article className="prototype-job-card" key={post.id}>
            <div className="prototype-rank">#{index + 1}</div>
            <div className="prototype-job-main">
              <div className="prototype-card-heading">
                <div>
                  <span className="eyebrow">{post.salonName}</span>
                  <h3>{post.title}</h3>
                </div>
                <StatusPill value={post.matchLevel} />
              </div>
              <div className="prototype-job-meta">
                <span><MapPin size={15} />{post.location}</span>
                <span><BriefcaseBusiness size={15} />{post.experience}+ years</span>
              </div>
              <div className="prototype-chips">
                {post.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
              <p className="prototype-match-reason"><Sparkles size={16} />{post.reason}</p>
            </div>
            <div className="prototype-score">
              <strong>{post.matchScore}%</strong>
              <span>profile match</span>
              <button className="btn btn-primary btn-small" type="button" disabled={post.applied} onClick={() => onApply(post)}>
                {post.applied ? <CheckCircle2 size={16} /> : <Send size={16} />}
                {post.applied ? "Applied" : "Apply now"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MyApplicationsView({ applications }) {
  const mine = applications.filter((item) => item.candidate === "Lina Haddad");
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Candidate experience" title="My applications" description="A candidate can track every application once. Rejected applications stay final and cannot be submitted again." />
      <div className="prototype-grid-two">
        {mine.map((application) => (
          <article className="prototype-card" key={application.id}>
            <div className="prototype-card-heading">
              <div><span className="eyebrow">{application.salonName}</span><h3>{application.title}</h3></div>
              <StatusPill value={application.status} />
            </div>
            <div className="prototype-application-score"><Sparkles size={18} /><strong>{application.matchScore}% match</strong><StatusPill value={application.matchLevel} /></div>
            <p>{application.note}</p>
            <div className="prototype-chips">{application.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="prototype-card-footer">
              <span><FileCheck2 size={16} />{application.resumeUploaded ? "Résumé attached" : "No résumé"}</span>
              <span>Applied once</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HiringApplicationsView({ applications, onDecision, onInvite }) {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "SUGGESTED", "MATCHED", "MISSING_REQUIREMENTS"];
  const visible = applications
    .filter((item) => filter === "ALL" || item.matchLevel === filter)
    .sort((a, b) => b.matchScore - a.matchScore);
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Salon owner experience" title="Ranked hiring applications" description="Every applicant reaches the owner. Strong matches are sorted first; candidates with missing requirements follow." />
      <div className="prototype-filter-row">
        {filters.map((item) => (
          <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>
            {item.replaceAll("_", " ")}<span>{applications.filter((application) => item === "ALL" || application.matchLevel === item).length}</span>
          </button>
        ))}
      </div>
      <div className="prototype-candidate-list">
        {visible.length === 0 ? <EmptyPrototype title="No candidates in this filter" description="Choose another match level to inspect the demo applications." /> : visible.map((candidate, index) => (
          <article className="prototype-candidate-card" key={candidate.id}>
            <div className="prototype-rank">#{index + 1}</div>
            <div className="prototype-candidate-main">
              <div className="prototype-card-heading">
                <div><h3>{candidate.candidate}</h3><p>{candidate.title} · {candidate.years} years experience</p></div>
                <StatusPill value={candidate.status} />
              </div>
              <div className="prototype-chips">{candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <p className="prototype-candidate-note">“{candidate.note}”</p>
              <div className="prototype-card-footer"><span>{candidate.email}</span><span>{candidate.phone}</span><span>{candidate.resumeUploaded ? "Résumé available" : "Résumé optional · not added"}</span></div>
            </div>
            <div className="prototype-score">
              <strong>{candidate.matchScore}%</strong><StatusPill value={candidate.matchLevel} />
              {candidate.status === "Requested" && (
                <div className="prototype-actions-stack">
                  <button className="btn btn-primary btn-small" type="button" onClick={() => onDecision(candidate.id, true)}><UserCheck size={16} />Accept</button>
                  <button className="btn btn-secondary btn-small" type="button" onClick={() => onInvite(candidate)}><UserRoundPlus size={16} />Invite</button>
                  <button className="prototype-text-danger" type="button" onClick={() => onDecision(candidate.id, false)}><XCircle size={15} />Reject</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function InvitationsView({ role, invitations, applications, onDecision, onInvite }) {
  const pendingCandidates = applications.filter((item) => item.status === "Requested");
  return (
    <div className="prototype-view">
      <SectionHeading
        eyebrow={role === "owner" ? "Salon owner experience" : "Candidate experience"}
        title={role === "owner" ? "Team invitations" : "Salon invitations"}
        description={role === "owner" ? "Invite candidates from their career profile and track the full invitation lifecycle." : "Review invitations sent by salons. Accepting may create a leave request when already employed elsewhere."}
      />
      {role === "owner" && (
        <div className="prototype-invite-candidates">
          {pendingCandidates.slice(0, 3).map((candidate) => (
            <button type="button" onClick={() => onInvite(candidate)} key={candidate.id}>
              <span className="prototype-mini-avatar">{candidate.candidate.split(" ").map((part) => part[0]).join("")}</span>
              <span><strong>{candidate.candidate}</strong><small>{candidate.title} · {candidate.matchScore}% match</small></span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      )}
      <div className="prototype-grid-two">
        {invitations.map((invitation) => (
          <article className="prototype-card" key={invitation.id}>
            <div className="prototype-card-heading">
              <div><span className="eyebrow">{invitation.salonName}</span><h3>{invitation.candidate}</h3></div>
              <StatusPill value={invitation.status} />
            </div>
            <p>{invitation.specialty}</p>
            <div className="prototype-card-footer"><span>{invitation.source.replaceAll("_", " ")}</span><span>{invitation.createdAt}</span></div>
            {role === "customer" && invitation.candidate === "Lina Haddad" && invitation.status === "Requested" && (
              <div className="prototype-card-actions">
                <button className="btn btn-primary btn-small" type="button" onClick={() => onDecision(invitation.id, true)}><CheckCircle2 size={16} />Accept invitation</button>
                <button className="btn btn-secondary btn-small" type="button" onClick={() => onDecision(invitation.id, false)}>Reject</button>
              </div>
            )}
            {invitation.status === "Accepted_Pending_Leave" && <FeatureNote>The candidate accepted, and the current salon owner must decide the linked leave request.</FeatureNote>}
          </article>
        ))}
      </div>
    </div>
  );
}
