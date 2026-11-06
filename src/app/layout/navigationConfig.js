import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Compass,
  FileEdit,
  Home,
  LockKeyhole,
  Scissors,
  Settings2,
  Store,
  UsersRound,
} from "lucide-react";

function getTokenClaims(token) {
  if (!token) return {};
  try {
    const payload = token.split(".")[1];
    return payload ? JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) : {};
  } catch {
    return {};
  }
}

export function getNavigationSections({ token, loggedIn }) {
  const claims = getTokenClaims(token);
  const role = String(claims.role || claims.roles?.[0] || "").toUpperCase();
  const hasSalon = Boolean(claims.salonId || claims.salon_id);
  const isOwner = role === "OWNER" || role === "SALON_OWNER";
  const sections = [
    {
      label: "Discover",
      items: [
        { label: "Home", to: "/", icon: Home },
        { label: "Explore the platform", to: "/explore", icon: Compass },
      ],
    },
  ];

  if (!loggedIn) return sections;

  sections.push({
    label: "My activity",
    items: [
      { label: "My bookings", to: "/my-bookings", icon: CalendarDays },
      { label: "Notifications", to: "/notifications", icon: Bell },
    ],
  });
  sections.push({
    label: "Career",
    items: [
      { label: "Career opportunities", to: "/hiring-posts", icon: BriefcaseBusiness },
      { label: "Career profile", to: "/profile/career", icon: UsersRound },
      { label: "My applications", to: "/my-applications", icon: ClipboardList },
      { label: "Employment center", to: "/employment", icon: Store },
    ],
  });
  sections.push({
    label: "For salon owners",
    items: [{ label: "Create a salon", to: "/owner/create-salon", icon: Store }],
  });

  if (hasSalon) {
    sections.push({
      label: "Employee",
      items: [{ label: "My appointments", to: "/employee/bookings", icon: CalendarDays }],
    });
  }

  if (isOwner) {
    sections.push(
      {
        label: "Owner overview",
        items: [
          { label: "Dashboard", to: "/owner/dashboard", icon: Store },
          { label: "My salon", to: "/owner/my-salon", icon: Store },
          { label: "Booking requests", to: "/owner/bookings", icon: CalendarDays, badge: "3" },
        ],
      },
      {
        label: "Salon management",
        items: [
          { label: "Services", to: "/owner/services", icon: Scissors },
          { label: "Team & schedules", to: "/owner/employees", icon: UsersRound },
          { label: "Employment", to: "/owner/employment", icon: BriefcaseBusiness },
          { label: "Hiring applications", to: "/owner/applications", icon: ClipboardList },
        ],
      },
      {
        label: "Create & update",
        items: [
          { label: "Edit salon", to: "/owner/edit-salon", icon: FileEdit },
          { label: "New service", to: "/owner/services/new", icon: Scissors },
          { label: "New hiring post", to: "/owner/create-hiring-post", icon: BriefcaseBusiness },
        ],
      },
    );
  }

  sections.push({
    label: "Account",
    items: [{ label: "Account security", to: "/account/security", icon: LockKeyhole }],
  });
  return sections.filter((section) => section.items.length);
}
