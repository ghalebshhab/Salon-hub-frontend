// Header context for the current route: a section label and a page title.
const PAGE_TITLES = [
  [/^\/$/, "Discover", "Home"],
  [/^\/community\/people\/[^/]+/, "Community", "Member profile"],
  [/^\/community/, "Community", "Community"],
  [/^\/hiring-posts\/[^/]+\/apply/, "Careers", "Apply"],
  [/^\/hiring-posts/, "Careers", "Career opportunities"],
  [/^\/salons\/[^/]+\/book/, "Discover", "Book an appointment"],
  [/^\/salons\/[^/]+/, "Discover", "Salon profile"],
  [/^\/my-bookings/, "My activity", "My bookings"],
  [/^\/notifications/, "My activity", "Notifications"],
  [/^\/profile\/career/, "Career", "Career profile"],
  [/^\/my-applications/, "Career", "My applications"],
  [/^\/employment/, "Career", "Employment center"],
  [/^\/employee\/bookings/, "Employee", "My appointments"],
  [/^\/account\/security/, "Account", "Account security"],
  [/^\/owner\/dashboard/, "Salon", "Dashboard"],
  [/^\/owner\/my-salon\/edit/, "Salon", "Edit salon"],
  [/^\/owner\/my-salon/, "Salon", "My salon"],
  [/^\/owner\/create-salon/, "Salon", "Create salon"],
  [/^\/owner\/bookings/, "Salon", "Booking requests"],
  [/^\/owner\/services\/[^/]+\/edit/, "Salon", "Edit service"],
  [/^\/owner\/services/, "Salon", "Services"],
  [/^\/owner\/create-service/, "Salon", "New service"],
  [/^\/owner\/employees\/[^/]+\/setup/, "Salon", "Employee setup"],
  [/^\/owner\/employees/, "Salon", "Team & schedules"],
  [/^\/owner\/employment/, "Salon", "Employment"],
  [/^\/owner\/applications/, "Salon", "Hiring applications"],
  [/^\/owner\/create-hiring-post/, "Salon", "New hiring post"],
];

export function pageTitleFor(pathname) {
  const match = PAGE_TITLES.find(([pattern]) => pattern.test(pathname));
  return match ? { section: match[1], title: match[2] } : null;
}
