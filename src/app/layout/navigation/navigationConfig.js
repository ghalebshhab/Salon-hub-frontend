import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardList,
  House,
  LayoutDashboard,
  Sparkles,
  Scissors,
  UserPlus,
  UsersRound,
} from "lucide-react";

export const exploreLinks = [
  { to: "/", label: "Home", icon: House, public: true },
  { to: "/prototype", label: "Prototype", icon: Sparkles, public: true },
  { to: "/my-bookings", label: "My bookings", icon: CalendarDays },
  { to: "/hiring-posts", label: "Careers", icon: BriefcaseBusiness },
];

export const ownerLinks = [
  { to: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/my-salon", label: "My salon", icon: Building2 },
  { to: "/owner/bookings", label: "Booking requests", icon: CalendarDays },
  { to: "/owner/services", label: "Services", icon: Scissors },
  { to: "/owner/employees", label: "Team & schedules", icon: UsersRound },
  {
    to: "/owner/applications",
    label: "Hiring applications",
    icon: ClipboardList,
  },
];

export const ownerActions = [
  {
    to: "/owner/create-salon",
    label: "Create salon",
    icon: Building2,
    className: "dropdown-quiet-action",
  },
  {
    to: "/owner/create-hiring-post",
    label: "New hiring post",
    icon: UserPlus,
    className: "dropdown-primary-action",
  },
];

export const accountLinks = [
  { to: "/profile/career", label: "Career profile", icon: BriefcaseBusiness },
  { to: "/my-applications", label: "My applications", icon: ClipboardList },
  { to: "/notifications", label: "Notifications", icon: Bell },
];
