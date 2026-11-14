import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  FileText,
  Handshake,
  House,
  IdCard,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  Scissors,
  SquarePen,
  Store,
  UserCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";

/**
 * Sidebar sections for the signed-in role. Every destination has its own
 * icon so the collapsed (icon-only) sidebar stays unambiguous. Owner create
 * actions live in the Salon section's "New" menu (`actions`) instead of a
 * separate list of links. Account security sits in the sidebar footer.
 */
export function getNavigationSections({
  loggedIn,
  isOwner,
  hasSalon,
  isEmployee = false,
}) {
  const sections = [
    {
      label: "Discover",
      items: [
        { label: "Home", to: "/", icon: House, end: true },
        { label: "Community", to: "/community", icon: MessagesSquare },
        {
          label: "Career opportunities",
          to: "/hiring-posts",
          icon: BriefcaseBusiness,
        },
      ],
    },
  ];

  if (!loggedIn) return sections;

  sections.push(
    {
      label: "My activity",
      items: [
        { label: "My bookings", to: "/my-bookings", icon: CalendarCheck },
        {
          label: "Notifications",
          to: "/notifications",
          icon: Bell,
          badge: "unreadNotifications",
        },
      ],
    },
    {
      label: "Career",
      items: [
        { label: "Career profile", to: "/profile/career", icon: IdCard },
        { label: "My applications", to: "/my-applications", icon: FileText },
        { label: "Employment center", to: "/employment", icon: Handshake },
      ],
    },
  );

  if (isEmployee) {
    sections.push({
      label: "Employee",
      items: [
        {
          label: "My appointments",
          to: "/employee/bookings",
          icon: CalendarClock,
        },
      ],
    });
  }

  if (isOwner) {
    sections.push({
      label: "Salon",
      items: [
        { label: "Dashboard", to: "/owner/dashboard", icon: LayoutDashboard },
        { label: "My salon", to: "/owner/my-salon", icon: Store, end: true },
        {
          label: "Booking requests",
          to: "/owner/bookings",
          icon: Inbox,
          badge: "pendingBookings",
        },
        { label: "Services", to: "/owner/services", icon: Scissors },
        {
          label: "Team & schedules",
          to: "/owner/employees",
          icon: UsersRound,
        },
        { label: "Employment", to: "/owner/employment", icon: UserCheck },
        {
          label: "Hiring applications",
          to: "/owner/applications",
          icon: ClipboardList,
        },
      ],
      actions: [
        hasSalon
          ? { label: "Edit salon", to: "/owner/my-salon/edit", icon: SquarePen }
          : {
              label: "Create salon",
              to: "/owner/create-salon",
              icon: Building2,
            },
        { label: "New service", to: "/owner/create-service", icon: Scissors },
        {
          label: "New hiring post",
          to: "/owner/create-hiring-post",
          icon: UserPlus,
        },
      ],
    });
  }

  return sections;
}
