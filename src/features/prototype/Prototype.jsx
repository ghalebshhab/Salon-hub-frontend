import {
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  RefreshCcw,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { CustomerBookingsView, EmployeeBookingsView, OwnerBookingsView } from "./BookingViews.jsx";
import { CareersView, HiringApplicationsView, InvitationsView, MyApplicationsView } from "./CareerHiringViews.jsx";
import { NotificationsView, OverviewView, ScheduleView } from "./WorkspaceViews.jsx";
import OwnerDashboardPrototype from "./OwnerDashboardPrototype.jsx";
import { prototypeRoles } from "./prototypeData.js";
import usePrototypeWorkspace from "./usePrototypeWorkspace.js";

const sectionIcons = {
  overview: LayoutDashboard,
  dashboard: LayoutDashboard,
  careers: BriefcaseBusiness,
  applications: BriefcaseBusiness,
  invitations: UsersRound,
  bookings: CalendarDays,
  "owner-bookings": CalendarDays,
  "employee-bookings": CalendarDays,
  hiring: UsersRound,
  schedule: CalendarDays,
  notifications: BellRing,
};

function PrototypeContent({ workspace }) {
  const commonBookings = { bookings: workspace.bookings, onUpdate: workspace.updateBooking };
  switch (workspace.section) {
    case "dashboard":
      return <OwnerDashboardPrototype onActivity={workspace.setActivity} />;
    case "careers":
      return <CareersView posts={workspace.hiringPosts} onApply={workspace.applyToPost} />;
    case "applications":
      return <MyApplicationsView applications={workspace.applications} />;
    case "invitations":
      return <InvitationsView role={workspace.role} invitations={workspace.invitations} applications={workspace.applications} onDecision={workspace.decideInvitation} onInvite={workspace.inviteCandidate} />;
    case "bookings":
      return <CustomerBookingsView {...commonBookings} />;
    case "owner-bookings":
      return <OwnerBookingsView {...commonBookings} employees={workspace.employees} />;
    case "employee-bookings":
      return <EmployeeBookingsView bookings={workspace.bookings} />;
    case "hiring":
      return <HiringApplicationsView applications={workspace.applications} onDecision={workspace.decideApplication} onInvite={workspace.inviteCandidate} />;
    case "schedule":
      return <ScheduleView role={workspace.role} schedule={workspace.schedule} onUpdate={workspace.updateSchedule} onToggle={workspace.toggleScheduleDay} onAdd={workspace.addSchedulePeriod} />;
    case "notifications":
      return <NotificationsView notifications={workspace.notifications} onRead={workspace.markNotificationRead} onReadAll={workspace.markAllRead} />;
    default:
      return <OverviewView role={workspace.role} bookings={workspace.bookings} applications={workspace.applications} invitations={workspace.invitations} schedule={workspace.schedule} notifications={workspace.notifications} onNavigate={workspace.setSection} />;
  }
}

export default function Prototype() {
  const workspace = usePrototypeWorkspace();
  return (
    <main className="prototype-page">
      <header className="prototype-header container">
        <div className="prototype-header-copy">
          <span className="prototype-kicker"><Sparkles size={16} />Interactive product prototype</span>
          <h1>Experience SalonHub before the database is filled.</h1>
          <p>Explore all current flows with connected local scenarios. Changes stay inside this page and reset instantly.</p>
        </div>
        <button className="prototype-reset" type="button" onClick={workspace.reset}><RefreshCcw size={17} />Reset demo</button>
      </header>

      <section className="prototype-role-switcher container" aria-label="Choose a prototype role">
        {prototypeRoles.map((item) => (
          <button aria-label={item.label} className={workspace.role === item.id ? "active" : ""} type="button" onClick={() => workspace.setRole(item.id)} key={item.id}>
            <span className="prototype-role-icon">{item.id === "customer" ? <UserRound size={20} /> : item.id === "owner" ? <LayoutDashboard size={20} /> : <UsersRound size={20} />}</span>
            <span><strong>{item.label}</strong><small>{item.description}</small></span>
            <ChevronRight size={18} />
          </button>
        ))}
      </section>

      <div className="prototype-workspace container">
        <aside className="prototype-sidebar">
          <div><span className="prototype-sidebar-label">Preview as</span><strong>{prototypeRoles.find((item) => item.id === workspace.role)?.label}</strong></div>
          <nav aria-label="Prototype sections">
            {workspace.sections.map((item) => {
              const Icon = sectionIcons[item.id] || LayoutDashboard;
              return <button className={workspace.section === item.id ? "active" : ""} type="button" onClick={() => workspace.setSection(item.id)} key={item.id}><Icon size={17} /><span>{item.label}</span><ChevronRight size={15} /></button>;
            })}
          </nav>
          <div className="prototype-sidebar-note"><Sparkles size={17} /><p><strong>Safe demo mode</strong>No API calls or database writes.</p></div>
        </aside>

        <section className="prototype-canvas" aria-live="polite">
          <div className="prototype-activity"><span />{workspace.activity}</div>
          <PrototypeContent workspace={workspace} />
        </section>
      </div>
    </main>
  );
}
