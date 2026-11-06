import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardList,
  Compass,
  FileEdit,
  Handshake,
  Home,
  LayoutDashboard,
  LockKeyhole,
  Scissors,
  Store,
  UserPlus,
  UsersRound,
} from "lucide-react";

export function getNavigationSections({ loggedIn, user, isOwner }) {
  const isEmployee = Boolean(user?.salonId);
  const hasOwnedSalon = Boolean(user?.ownedSalonId);
  const sections = [
    {
      label: "Discover",
      items: [
        { label: "Home", to: "/", icon: Home },
        { label: "Explore the platform", to: "/prototype", icon: Compass },
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
        {
          label: "Career opportunities",
          to: "/hiring-posts",
          icon: BriefcaseBusiness,
        },
        { label: "Career profile", to: "/profile/career", icon: UsersRound },
        {
          label: "My applications",
          to: "/my-applications",
          icon: ClipboardList,
        },
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
          icon: CalendarDays,
        },
      ],
    });
  }

  if (isOwner) {
    sections.push(
      {
        label: "Owner overview",
        items: [
          {
            label: "Dashboard",
            to: "/owner/dashboard",
            icon: LayoutDashboard,
          },
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
            icon: Handshake,
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
            label: "Edit salon",
            to: "/owner/my-salon/edit",
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
  } else if (hasOwnedSalon) {
    sections.push({
      label: "Salon",
      items: [{ label: "My salon", to: "/owner/my-salon", icon: Store }],
    });
  } else {
    sections.push({
      label: "For salon owners",
      items: [
        {
          label: "Create a salon",
          to: "/owner/create-salon",
          icon: Building2,
        },
      ],
    });
  }

  sections.push({
    label: "Account",
    items: [
      {
        label: "Account security",
        to: "/account/security",
        icon: LockKeyhole,
      },
    ],
  });

  return sections;
}
