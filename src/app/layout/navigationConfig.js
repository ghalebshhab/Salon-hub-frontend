import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileEdit,
  Home,
  LockKeyhole,
  MessageSquareText,
  Scissors,
  Store,
  UserPlus,
  UsersRound,
} from "lucide-react";

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
        { label: "Home", to: "/", icon: Home, end: true },
        { label: "Community", to: "/community", icon: MessageSquareText },
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
        { label: "My bookings", to: "/my-bookings", icon: CalendarDays },
        { label: "Notifications", to: "/notifications", icon: Bell },
      ],
    },
    {
      label: "Career",
      items: [
        { label: "Career profile", to: "/profile/career", icon: UsersRound },
        {
          label: "My applications",
          to: "/my-applications",
          icon: ClipboardList,
        },
        { label: "Employment center", to: "/employment", icon: Store },
      ],
    },
  );

  if (isOwner) {
    sections.push(
      {
        label: "Owner overview",
        items: [
          { label: "Dashboard", to: "/owner/dashboard", icon: Store },
          { label: "My salon", to: "/owner/my-salon", icon: Store },
          {
            label: "Booking requests",
            to: "/owner/bookings",
            icon: CalendarDays,
          },
        ],
      },
      {
        label: "Salon management",
        items: [
          { label: "Services", to: "/owner/services", icon: Scissors },
          {
            label: "Team & schedules",
            to: "/owner/employees",
            icon: UsersRound,
          },
          {
            label: "Employment",
            to: "/owner/employment",
            icon: BriefcaseBusiness,
          },
          {
            label: "Hiring applications",
            to: "/owner/applications",
            icon: ClipboardList,
          },
        ],
      },
      {
        label: "Create & update",
        items: [
          {
            label: hasSalon ? "Edit salon" : "Create salon",
            to: hasSalon ? "/owner/my-salon/edit" : "/owner/create-salon",
            icon: FileEdit,
          },
          {
            label: "New service",
            to: "/owner/create-service",
            icon: Scissors,
          },
          {
            label: "New hiring post",
            to: "/owner/create-hiring-post",
            icon: UserPlus,
          },
        ],
      },
    );
  }

  if (isEmployee) {
    sections.push({
      label: "Employee",
      items: [
        {
          label: "My appointments",
          to: "/employee/bookings",
          icon: CalendarDays,
        },
      ],
    });
  }

  sections.push({
    label: "Account",
    items: [
      { label: "Account security", to: "/account/security", icon: LockKeyhole },
    ],
  });

  return sections;
}
