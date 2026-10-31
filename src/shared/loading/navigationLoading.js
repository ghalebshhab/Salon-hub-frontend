const navigationMessages = [
  [/^\/owner\/dashboard/, "Opening your salon dashboard…"],
  [/^\/owner\//, "Opening your salon workspace…"],
  [/^\/salons\/[^/]+\/book/, "Preparing your booking…"],
  [/^\/salons\//, "Opening the salon…"],
  [/^\/hiring-posts/, "Opening career opportunities…"],
  [/^\/my-bookings/, "Opening your bookings…"],
  [/^\/notifications/, "Opening your notifications…"],
  [/^\/profile/, "Opening your profile…"],
  [/^\/account\/security/, "Opening account security…"],
  [/^\/employment/, "Opening your employment center…"],
  [/^\/login/, "Opening sign in…"],
  [/^\/register/, "Opening registration…"],
  [/^\/verify-email/, "Opening email verification…"],
  [/^\/forgot-password/, "Opening account recovery…"],
  [/^\/verify-reset-code/, "Opening code verification…"],
  [/^\/reset-password/, "Opening password reset…"],
];

export function navigationMessageFor(pathname) {
  return (
    navigationMessages.find(([pattern]) => pattern.test(pathname))?.[1] ||
    "Opening the page…"
  );
}
