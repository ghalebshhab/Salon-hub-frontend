import {
  BellRing,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarDays,
  CheckCheck,
  Clock3,
  Plus,
  Scissors,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { MetricCard, ProfileSnapshot, SectionHeading, StatusPill } from "./PrototypePrimitives.jsx";
import { initialCareerProfile } from "./prototypeData.js";

const roleCopy = {
  customer: {
    eyebrow: "Customer & candidate demo",
    title: "One profile, two journeys",
    description: "Book salon services and build a career profile from the same account. Explore every current state with realistic local data.",
  },
  owner: {
    eyebrow: "Salon owner demo",
    title: "Operate the salon from one workspace",
    description: "Handle appointments, rank applicants, invite professionals, and configure employee availability.",
  },
  employee: {
    eyebrow: "Employee demo",
    title: "Your workday at a glance",
    description: "See assigned customers, services, schedule periods, and booking updates from the salon owner.",
  },
};

export function OverviewView({ role, bookings, applications, invitations, schedule, notifications, onNavigate }) {
  const copy = roleCopy[role];
  const metrics = role === "customer"
    ? [
        [CalendarDays, bookings.filter((item) => ["PENDING", "ACCEPTED"].includes(item.status)).length, "Upcoming bookings", "primary"],
        [BriefcaseBusiness, applications.filter((item) => item.candidate === "Lina Haddad").length, "Career applications", "accent"],
        [BellRing, notifications.filter((item) => !item.read).length, "Unread updates", "success"],
      ]
    : role === "owner"
      ? [
          [CalendarCheck2, bookings.filter((item) => item.status === "PENDING").length, "Pending bookings", "primary"],
          [UsersRound, applications.filter((item) => item.status === "Requested").length, "Candidates to review", "accent"],
          [UserRoundCheck, invitations.filter((item) => item.status === "Accepted").length, "Accepted invitations", "success"],
        ]
      : [
          [CalendarCheck2, bookings.filter((item) => item.assignedEmployeeId === 501 && item.status === "ACCEPTED").length, "Confirmed appointments", "primary"],
          [Clock3, Object.values(schedule).flat().length, "Weekly work periods", "accent"],
          [BellRing, notifications.filter((item) => !item.read).length, "Unread updates", "success"],
        ];

  return (
    <div className="prototype-view">
      <section className="prototype-overview-hero">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="prototype-card-actions">
            <button className="btn btn-primary" type="button" onClick={() => onNavigate(role === "customer" ? "careers" : role === "owner" ? "owner-bookings" : "employee-bookings")}>Open primary workflow</button>
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("notifications")}>See notifications</button>
          </div>
        </div>
        <div className="prototype-orbit" aria-hidden="true"><span><Scissors size={30} /></span><i /><i /><i /></div>
      </section>
      <div className="prototype-metrics">{metrics.map(([Icon, value, label, tone]) => <MetricCard icon={Icon} value={value} label={label} tone={tone} key={label} />)}</div>
      {role === "customer" && <ProfileSnapshot profile={initialCareerProfile} />}
      <section className="prototype-flow-panel">
        <div><span className="eyebrow">Connected flow</span><h3>Actions stay consistent across every role</h3><p>Accept a booking as the owner and its customer card updates. Assign Lina and the appointment appears in her employee view. Invite a candidate and answer it from the candidate view.</p></div>
        <div className="prototype-flow-steps"><span>Customer request</span><b>→</b><span>Owner decision</span><b>→</b><span>Employee schedule</span></div>
      </section>
    </div>
  );
}

export function ScheduleView({ role, schedule, onUpdate, onToggle, onAdd }) {
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow={role === "owner" ? "Team setup" : "Employee experience"} title={role === "owner" ? "Lina’s weekly schedule" : "My weekly schedule"} description={role === "owner" ? "Configure working periods within salon hours. Days may contain multiple shifts or remain off." : "This is the availability customers and the salon use when selecting appointment times."} />
      <section className="prototype-schedule-card">
        <div className="prototype-schedule-profile"><span className="prototype-mini-avatar">LH</span><div><h3>Lina Haddad</h3><p>Hair stylist & colorist · Salon hours 09:00–20:00</p></div><StatusPill value="ACTIVE" /></div>
        <div className="prototype-week">
          {Object.entries(schedule).map(([day, periods]) => (
            <div className="prototype-day" key={day}>
              <div className="prototype-day-title"><strong>{day[0] + day.slice(1).toLowerCase()}</strong>{role === "owner" && <button type="button" onClick={() => onToggle(day)}>{periods.length ? "Set day off" : "Add working day"}</button>}</div>
              <div className="prototype-periods">
                {periods.length === 0 ? <span className="prototype-day-off">Day off</span> : periods.map((period, index) => (
                  <div className="prototype-period" key={`${day}-${index}`}><Clock3 size={15} /><input type="time" value={period.start} disabled={role === "employee"} onChange={(event) => onUpdate(day, index, "start", event.target.value)} /><span>to</span><input type="time" value={period.end} disabled={role === "employee"} onChange={(event) => onUpdate(day, index, "end", event.target.value)} /></div>
                ))}
                {role === "owner" && periods.length > 0 && periods.length < 2 && <button className="prototype-add-period" type="button" onClick={() => onAdd(day)}><Plus size={15} />Split shift</button>}
              </div>
            </div>
          ))}
        </div>
        {role === "owner" && <button className="btn btn-primary" type="button"><CheckCheck size={17} />Save schedule</button>}
      </section>
    </div>
  );
}

export function NotificationsView({ notifications, onRead, onReadAll }) {
  return (
    <div className="prototype-view">
      <SectionHeading eyebrow="Persistent inbox" title="Notifications" description="User-specific booking, hiring, assignment, reschedule, and invitation updates remain available after returning to the app." action={<button className="btn btn-secondary btn-small" type="button" onClick={onReadAll}><CheckCheck size={16} />Mark all read</button>} />
      <div className="prototype-notification-list">
        {notifications.map((notification) => (
          <button className={notification.read ? "prototype-notification" : "prototype-notification unread"} type="button" onClick={() => onRead(notification.id)} key={notification.id}>
            <span className="prototype-notification-icon">{notification.type.includes("BOOKING") ? <CalendarDays size={19} /> : notification.type.includes("HIRING") || notification.type.includes("INVITATION") ? <BriefcaseBusiness size={19} /> : <BellRing size={19} />}</span>
            <span><strong>{notification.title}</strong><p>{notification.message}</p><small>{notification.time}</small></span>
            {!notification.read && <i aria-label="Unread" />}
          </button>
        ))}
      </div>
      <div className="prototype-polling-note"><Sparkles size={17} /><span><strong>Frontend behavior:</strong> polls every 30–60 seconds while signed in and refreshes when the app becomes active.</span></div>
    </div>
  );
}
