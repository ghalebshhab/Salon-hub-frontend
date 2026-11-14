import { KeyRound, LogIn, ShieldCheck, Store, UserPlus } from "lucide-react";
import { getNavigationSections } from "../layout/navigationConfig.js";

// Extra words people type for a destination, beyond its visible title.
const KEYWORDS = {
  "/": ["discover", "salons", "start"],
  "/community": ["feed", "posts", "people", "friends"],
  "/hiring-posts": ["jobs", "careers", "vacancies", "hiring"],
  "/my-bookings": ["appointments", "reservations"],
  "/notifications": ["alerts", "inbox", "updates"],
  "/profile/career": ["resume", "cv", "skills", "portfolio"],
  "/my-applications": ["jobs", "applied"],
  "/employment": ["invitations", "join", "leave", "transfer"],
  "/employee/bookings": ["schedule", "assigned"],
  "/owner/dashboard": ["analytics", "revenue", "overview", "stats"],
  "/owner/my-salon": ["profile", "cover", "location"],
  "/owner/bookings": ["appointments", "pending", "approve"],
  "/owner/services": ["menu", "prices", "catalog"],
  "/owner/employees": ["staff", "employees", "availability"],
  "/owner/employment": ["invite", "join requests", "staff"],
  "/owner/applications": ["candidates", "applicants"],
  "/owner/create-service": ["add service"],
  "/owner/create-hiring-post": ["job", "vacancy"],
  "/account/security": ["password", "login", "privacy"],
};

const SECTION_SUBTITLES = {
  Discover: "Discover",
  "My activity": "My activity",
  Career: "Career",
  Employee: "Employee",
  Salon: "Salon workspace",
};

/**
 * Every page the current visitor can open, built from the same navigation
 * config the sidebar uses so search and menu never drift apart.
 */
export function getSearchPages(auth) {
  const pages = getNavigationSections(auth).flatMap((section) =>
    [...section.items, ...(section.actions ?? [])].map((item) => ({
      id: `page:${item.to}`,
      title: item.label,
      subtitle: SECTION_SUBTITLES[section.label] ?? section.label,
      to: item.to,
      icon: item.icon,
      keywords: KEYWORDS[item.to] ?? [],
    })),
  );

  if (auth.loggedIn) {
    pages.push({
      id: "page:/account/security",
      title: "Account security",
      subtitle: "Account",
      to: "/account/security",
      icon: ShieldCheck,
      keywords: KEYWORDS["/account/security"],
    });
    if (!auth.isOwner && !auth.hasSalon) {
      pages.push({
        id: "page:/owner/create-salon",
        title: "List your salon",
        subtitle: "For salons",
        to: "/owner/create-salon",
        icon: Store,
        keywords: ["create salon", "open salon", "register salon"],
      });
    }
  } else {
    pages.push(
      {
        id: "page:/login",
        title: "Log in",
        subtitle: "Account",
        to: "/login",
        icon: LogIn,
        keywords: ["sign in"],
      },
      {
        id: "page:/register",
        title: "Create an account",
        subtitle: "Account",
        to: "/register",
        icon: UserPlus,
        keywords: ["join", "sign up", "register"],
      },
      {
        id: "page:/forgot-password",
        title: "Reset your password",
        subtitle: "Account",
        to: "/forgot-password",
        icon: KeyRound,
        keywords: ["forgot password", "recover"],
      },
    );
  }

  const seen = new Set();
  return pages.filter((page) => {
    if (seen.has(page.to)) return false;
    seen.add(page.to);
    return true;
  });
}

/**
 * Headings currently visible in the main region, as jump targets.
 * Headings without an id get a stable generated one so they can be scrolled to.
 */
export function collectPageSections(root) {
  if (!root) return [];
  const seen = new Set();
  return [...root.querySelectorAll("h1, h2, h3")]
    .filter((heading) =>
      // Skip headings in hidden panels; assume visible where the API is missing.
      typeof heading.checkVisibility === "function"
        ? heading.checkVisibility()
        : true,
    )
    .map((heading, index) => {
      const title = (heading.innerText || heading.textContent)
        .replace(/\s+/g, " ")
        .trim();
      if (!title || seen.has(title.toLocaleLowerCase())) return null;
      seen.add(title.toLocaleLowerCase());
      if (!heading.id) heading.id = `section-${index}-${slug(title)}`;
      return {
        id: `section:${heading.id}`,
        title,
        subtitle: heading.tagName === "H1" ? "Page title" : "On this page",
        targetId: heading.id,
      };
    })
    .filter(Boolean);
}

function slug(text) {
  return (
    text
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "heading"
  );
}
