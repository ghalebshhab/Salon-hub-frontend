import {
  Bug,
  LogIn,
  ServerCrash,
  ShieldAlert,
  Store,
  Unlink,
  UserX,
  WifiOff,
} from "lucide-react";

/**
 * Every error the app can show as a full page. Texts are English source keys;
 * ErrorPage translates them while rendering. Actions name a target, so the
 * page decides how to run them (link, history back, reload, retry).
 *
 * Action targets:
 *   "home" → "/", "login" → "/login" (keeps where the person was),
 *   "back" → previous page, "retry" → onRetry or reload, or any app path.
 */
export const ERROR_KINDS = {
  notFound: {
    code: "404",
    icon: Unlink,
    eyebrow: "Error 404",
    title: "This page took a different cut",
    message:
      "The link may be old, or the page has moved. Let us get you back to something good.",
    primary: { label: "Back to home", to: "home" },
    secondary: { label: "Go back", to: "back" },
    showShortcuts: true,
  },
  salonUnavailable: {
    code: "404",
    icon: Store,
    eyebrow: "Salon unavailable",
    title: "This salon is not open to visitors",
    message:
      "It may have closed, paused its page, or been removed. Other salons near you are ready to book.",
    primary: { label: "Browse salons", to: "/" },
    secondary: { label: "Go back", to: "back" },
    showShortcuts: true,
  },
  profileUnavailable: {
    code: "404",
    icon: UserX,
    eyebrow: "Profile unavailable",
    title: "This profile is not available",
    message:
      "The person may have hidden or removed their profile, or you can no longer view it.",
    primary: { label: "Return to community", to: "/community" },
    secondary: { label: "Go back", to: "back" },
  },
  forbidden: {
    code: "403",
    icon: ShieldAlert,
    eyebrow: "Error 403",
    title: "This area is not for your account",
    message:
      "Your account cannot open this page. If you think this is a mistake, contact your salon owner.",
    primary: { label: "Back to home", to: "home" },
    secondary: { label: "Go back", to: "back" },
  },
  signInRequired: {
    code: "401",
    icon: LogIn,
    eyebrow: "Sign in needed",
    title: "Please sign in to continue",
    message:
      "Your session has ended, or this page needs an account. Sign in and we will bring you right back.",
    primary: { label: "Sign in", to: "login" },
    secondary: { label: "Back to home", to: "home" },
  },
  serverError: {
    code: "500",
    icon: ServerCrash,
    eyebrow: "Error 500",
    title: "Something went wrong on our side",
    message:
      "We could not finish loading this page. Please try again in a moment.",
    primary: { label: "Try again", to: "retry" },
    secondary: { label: "Back to home", to: "home" },
  },
  offline: {
    code: "Offline",
    icon: WifiOff,
    eyebrow: "No connection",
    title: "You seem to be offline",
    message: "Check your internet connection, then try again.",
    primary: { label: "Try again", to: "retry" },
    secondary: { label: "Back to home", to: "home" },
  },
  crash: {
    code: "Oops",
    icon: Bug,
    eyebrow: "Unexpected error",
    title: "Something broke on this page",
    message:
      "Our team can fix it faster if it happens again. Reload the page, or go back home.",
    primary: { label: "Reload page", to: "retry" },
    secondary: { label: "Back to home", to: "home" },
  },
};

/** Quick ways back into the app, shown on "lost" pages. */
export const ERROR_SHORTCUTS = [
  { label: "Discover salons", to: "/" },
  { label: "My bookings", to: "/my-bookings" },
  { label: "Community", to: "/community" },
  { label: "Jobs", to: "/hiring-posts" },
];
