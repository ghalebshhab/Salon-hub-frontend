import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
/**
 * How a member's role reads on their profile. Professionals get a craft
 * title, not a job-board word: an employee is the salon's "Resident artist".
 * `tone` picks the avatar ring and badge colour.
 */
const PROFILE_ROLES = {
  OWNER: {
    key: "owner",
    label: t("Founder & owner"),
    salonPhrase: t("Founder & owner of"),
    tone: "gold",
    summary: t("Building a salon, a team, and memorable client experiences."),
  },
  MANAGER: {
    key: "manager",
    label: t("Salon manager"),
    salonPhrase: t("Salon manager & resident artist at"),
    tone: "rose",
    summary: t("Runs the day at the salon and keeps every visit on time."),
  },
  EMPLOYEE: {
    key: "artist",
    label: t("Resident artist"),
    salonPhrase: t("Resident artist at"),
    tone: "rose",
    summary: t(
      "Practicing and growing their craft within the salon community.",
    ),
  },
  ADMIN: {
    key: "team",
    label: t("SalonHub team"),
    salonPhrase: t("On the team at"),
    tone: "ink",
    summary: t("Helping keep the SalonHub community useful and welcoming."),
  },
  USER: {
    key: "explorer",
    label: t("Salon explorer"),
    salonPhrase: t("Connected to"),
    tone: "sage",
    summary: t("Discovering salons, professionals, and ideas across SalonHub."),
  },
};

export function getCommunityProfileRole(role, { manager = false } = {}) {
  const key = String(role || "USER").toUpperCase();
  if (key === "EMPLOYEE" && manager) return PROFILE_ROLES.MANAGER;
  return PROFILE_ROLES[key] || PROFILE_ROLES.USER;
}

/** Short verb phrase before the salon name, for example "Resident artist at". */
export function getSalonRelationship(role, options) {
  return getCommunityProfileRole(role, options).salonPhrase;
}

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Time at the salon: "New this month", "8 months", "1 year 3 months".
 * Returns null when the start date is unknown.
 */
export function salonTenure(since, now = new Date()) {
  const start = parseDate(since);
  if (!start) return null;
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  const startLabel = start.toLocaleDateString(dateLocale(), {
    month: "long",
    year: "numeric",
  });
  if (months < 1) return { length: t("New this month"), since: startLabel };
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearText =
    years === 1 ? t("1 year") : t("{count} years", { count: years });
  const monthText =
    rest === 1 ? t("1 month") : t("{count} months", { count: rest });
  const length =
    years && rest
      ? t("{years} {months}", { years: yearText, months: monthText })
      : years
        ? yearText
        : monthText;
  return { length, since: startLabel };
}

export function getCommunityProfileViewModel(profile, currentUserId) {
  const user = profile.member.user;
  const displayName = user.displayName || user.userName;
  const options = { manager: Boolean(profile.salonManager) };

  return {
    user,
    displayName,
    firstName: displayName.split(" ")[0],
    isSelf: Number(currentUserId) === Number(user.id),
    role: getCommunityProfileRole(profile.role, options),
    salonRelationship: getSalonRelationship(profile.role, options),
    tenure: profile.salonId ? salonTenure(profile.salonSince) : null,
  };
}
