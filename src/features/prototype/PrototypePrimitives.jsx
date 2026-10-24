import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Scissors,
  UserRound,
} from "lucide-react";

export function StatusPill({ value }) {
  return (
    <span className={`prototype-status prototype-status-${String(value).toLowerCase().replaceAll("_", "-")}`}>
      {String(value).replaceAll("_", " ")}
    </span>
  );
}

export function MetricCard({ icon: Icon, value, label, tone = "primary" }) {
  return (
    <article className={`prototype-metric prototype-tone-${tone}`}>
      <span><Icon size={20} /></span>
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  );
}

export function BookingSummary({ booking }) {
  return (
    <>
      <div className="prototype-booking-meta">
        <span><CalendarDays size={15} />{booking.bookingDate}</span>
        <span><Clock3 size={15} />{booking.bookingTime}</span>
        <span><MapPin size={15} />{booking.customerLocation}</span>
        <span><UserRound size={15} />{booking.assignedEmployeeName || "Unassigned"}</span>
      </div>
      <div className="prototype-chips">
        {booking.services.map((service) => (
          <span key={service.id}><Scissors size={13} />{service.name} · {service.price} JD</span>
        ))}
      </div>
      <div className="prototype-total">
        <span>{booking.totalDurationMinutes} minutes</span>
        <strong>{booking.totalPrice} JD</strong>
      </div>
    </>
  );
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <header className="prototype-section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

export function ProfileSnapshot({ profile }) {
  return (
    <article className="prototype-profile-card">
      <div className="prototype-avatar">LH</div>
      <div className="prototype-profile-copy">
        <span className="eyebrow">Career profile</span>
        <h3>{profile.name}</h3>
        <p>{profile.title} · {profile.location}</p>
        <div className="prototype-chips">
          {profile.skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </div>
      <div className="prototype-completion" style={{ "--completion": `${profile.completion}%` }}>
        <strong>{profile.completion}%</strong>
        <span>complete</span>
      </div>
    </article>
  );
}

export function FeatureNote({ children }) {
  return <div className="prototype-feature-note"><CheckCircle2 size={17} />{children}</div>;
}

export function EmptyPrototype({ title, description }) {
  return (
    <div className="prototype-empty">
      <BriefcaseBusiness size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
