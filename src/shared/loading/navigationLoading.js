import t from "../i18n/t.js";
const navigationMessages = [
  [/^\/owner\/dashboard/, t("Opening your salon dashboard…")],
  [/^\/owner\//, t("Opening your salon workspace…")],
  [/^\/salons\/[^/]+\/book/, t("Preparing your booking…")],
  [/^\/salons\//, t("Opening the salon…")],
  [/^\/hiring-posts/, t("Opening career opportunities…")],
  [/^\/my-bookings/, t("Opening your bookings…")],
  [/^\/notifications/, t("Opening your notifications…")],
  [/^\/profile/, t("Opening your profile…")],
  [/^\/account\/security/, t("Opening account security…")],
  [/^\/employment/, t("Opening your employment center…")],
  [/^\/login/, t("Opening sign in…")],
  [/^\/register/, t("Opening registration…")],
  [/^\/verify-email/, t("Opening email verification…")],
  [/^\/forgot-password/, t("Opening account recovery…")],
  [/^\/verify-reset-code/, t("Opening code verification…")],
  [/^\/reset-password/, t("Opening password reset…")],
];

export function navigationMessageFor(pathname) {
  return (
    navigationMessages.find(([pattern]) => pattern.test(pathname))?.[1] ||
    t("Opening the page…")
  );
}
