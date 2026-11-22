import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
export function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "SH"
  );
}

export function getPostAuthorName(post) {
  return post.salon?.name || post.author.displayName || post.author.userName;
}

export function formatPostDate(value, locale = dateLocale()) {
  if (!value) return "";
  return new Date(value).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isVideoMedia(url = "") {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export function getRelationshipLabel(member) {
  if (member.relationship === "ACCEPTED") return t("Friend");
  if (member.incomingRequest) return t("Requested you");
  return t("Pending");
}

export function normalizeCommunitySearch(value = "") {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
