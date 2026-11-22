import { createElement } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Crown,
  FileText,
  Handshake,
  House,
  IdCard,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  Scissors,
  SquarePen,
  SquarePlus,
  Store,
  UserCheck,
  UsersRound,
  Wallet,
} from "lucide-react";
import LamsaMark from "../../features/assistant/components/LamsaMark.jsx";
import { ASSISTANT_NAME } from "../../features/assistant/model/assistantIdentity.js";
import t from "../../shared/i18n/t.js";

// The assistant keeps its own mark in the menu, drawn in line-icon style.
const LamsaIcon = (props) =>
  createElement(LamsaMark, { tone: "mono", ...props });

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
  isManager = false,
}) {
  const sections = [
    {
      label: t("Discover"),
      items: [
        { label: t("Home"), to: "/", icon: House, end: true },
        { label: t("Community"), to: "/community", icon: MessagesSquare },
        {
          label: t("Career opportunities"),
          to: "/hiring-posts",
          icon: BriefcaseBusiness,
        },
        {
          label: t("Ask {ASSISTANT_NAME}", { ASSISTANT_NAME }),
          to: "/assistant",
          icon: LamsaIcon,
        },
      ],
    },
  ];

  if (!loggedIn) return sections;

  sections.push(
    {
      label: t("My activity"),
      items: [
        { label: t("My bookings"), to: "/my-bookings", icon: CalendarCheck },
        {
          label: t("Notifications"),
          to: "/notifications",
          icon: Bell,
          badge: "unreadNotifications",
        },
      ],
    },
    {
      label: t("Career"),
      items: [
        { label: t("Career profile"), to: "/profile/career", icon: IdCard },
        { label: t("My applications"), to: "/my-applications", icon: FileText },
        { label: t("Employment center"), to: "/employment", icon: Handshake },
      ],
    },
  );

  if (isEmployee) {
    sections.push({
      label: t("Employee"),
      items: [
        {
          label: t("My appointments"),
          to: "/employee/bookings",
          icon: CalendarClock,
        },
      ],
    });
  }

  if (isManager && !isOwner) {
    sections.push({
      label: t("Salon"),
      items: [
        {
          label: t("Booking requests"),
          to: "/owner/bookings",
          icon: Inbox,
          badge: "pendingBookings",
        },
        {
          label: t("Team & schedules"),
          to: "/owner/employees",
          icon: UsersRound,
        },
      ],
    });
  }

  if (isOwner) {
    sections.push({
      label: t("Salon"),
      items: [
        {
          label: t("Dashboard"),
          to: "/owner/dashboard",
          icon: LayoutDashboard,
        },
        { label: t("My salon"), to: "/owner/my-salon", icon: Store, end: true },
        {
          label: t("Booking requests"),
          to: "/owner/bookings",
          icon: Inbox,
          badge: "pendingBookings",
        },
        { label: t("Payments"), to: "/owner/payments", icon: Wallet },
        { label: t("My plan"), to: "/owner/plan", icon: Crown },
        { label: t("Services"), to: "/owner/services", icon: Scissors },
        {
          label: t("Team & schedules"),
          to: "/owner/employees",
          icon: UsersRound,
        },
        { label: t("Employment"), to: "/owner/employment", icon: UserCheck },
        {
          label: t("Hiring applications"),
          to: "/owner/applications",
          icon: ClipboardList,
        },
      ],
      actions: [
        hasSalon
          ? {
              label: t("Edit salon"),
              to: "/owner/my-salon/edit",
              icon: SquarePen,
            }
          : {
              label: t("Create salon"),
              to: "/owner/create-salon",
              icon: Building2,
            },
        {
          label: t("New service"),
          to: "/owner/create-service",
          icon: SquarePlus,
        },
        {
          label: t("New hiring post"),
          to: "/owner/create-hiring-post",
          icon: Megaphone,
        },
      ],
    });
  }

  return sections;
}
