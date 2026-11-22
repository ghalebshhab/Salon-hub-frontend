import { ASSISTANT_NAME } from "../../features/assistant/model/assistantIdentity.js";
import t from "../../shared/i18n/t.js";

// Header context for the current route: a section label and a page title.
const PAGE_TITLES = [
  [/^\/$/, t("Discover"), t("Home")],
  [
    /^\/assistant/,
    t("Discover"),
    t("Ask {ASSISTANT_NAME}", { ASSISTANT_NAME }),
  ],
  [/^\/community\/people\/[^/]+/, t("Community"), t("Member profile")],
  [/^\/community/, t("Community"), t("Community")],
  [/^\/hiring-posts\/[^/]+\/apply/, t("Careers"), t("Apply")],
  [/^\/hiring-posts/, t("Careers"), t("Career opportunities")],
  [/^\/salons\/[^/]+\/book/, t("Discover"), t("Book an appointment")],
  [/^\/salons\/[^/]+/, t("Discover"), t("Salon profile")],
  [/^\/my-bookings/, t("My activity"), t("My bookings")],
  [/^\/notifications/, t("My activity"), t("Notifications")],
  [/^\/profile\/career/, t("Career"), t("Career profile")],
  [/^\/my-applications/, t("Career"), t("My applications")],
  [/^\/employment/, t("Career"), t("Employment center")],
  [/^\/employee\/bookings/, t("Employee"), t("My appointments")],
  [/^\/account\/security/, t("Account"), t("Account security")],
  [/^\/settings/, t("Account"), t("Settings")],
  [/^\/owner\/dashboard/, t("Salon"), t("Dashboard")],
  [/^\/owner\/my-salon\/edit/, t("Salon"), t("Edit salon")],
  [/^\/owner\/my-salon/, t("Salon"), t("My salon")],
  [/^\/owner\/create-salon/, t("Salon"), t("Create salon")],
  [/^\/owner\/bookings/, t("Salon"), t("Booking requests")],
  [/^\/owner\/services\/[^/]+\/edit/, t("Salon"), t("Edit service")],
  [/^\/owner\/services/, t("Salon"), t("Services")],
  [/^\/owner\/create-service/, t("Salon"), t("New service")],
  [/^\/owner\/employees\/[^/]+\/setup/, t("Salon"), t("Employee setup")],
  [/^\/owner\/employees/, t("Salon"), t("Team & schedules")],
  [/^\/owner\/employment/, t("Salon"), t("Employment")],
  [/^\/owner\/applications/, t("Salon"), t("Hiring applications")],
  [/^\/owner\/create-hiring-post/, t("Salon"), t("New hiring post")],
];

export function pageTitleFor(pathname) {
  const match = PAGE_TITLES.find(([pattern]) => pattern.test(pathname));
  return match ? { section: match[1], title: match[2] } : null;
}
