import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
/** Rules and helpers for the reviews section on the salon page. */

export const REVIEWS_PAGE_SIZE = 6;
export const COMMENT_PREVIEW_LENGTH = 220;
export const STAR_VALUES = [5, 4, 3, 2, 1];
/** Show filter and sort controls only when there is something to sort. */
export const REVIEW_TOOLS_MIN = 4;

export const REVIEW_SORTS = [
  { value: "newest", label: t("Newest first") },
  { value: "highest", label: t("Highest rated") },
  { value: "lowest", label: t("Lowest rated") },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** A rounded rating such as 4.7, or 0 when there are no reviews. */
export function roundRating(value) {
  const number = Number(value) || 0;
  return Math.round(number * 10) / 10;
}

/** A short word for the average, like the labels on booking sites. */
export function ratingLabel(value) {
  if (value >= 4.6) return t("Excellent");
  if (value >= 4) return t("Very good");
  if (value >= 3) return t("Good");
  if (value >= 2) return t("Fair");
  if (value > 0) return t("Poor");
  return t("No ratings yet");
}

/** How many reviews have each star value, with the share of the total. */
export function ratingBreakdown(reviews) {
  const total = reviews.length;
  return STAR_VALUES.map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    return {
      stars,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    };
  });
}

/** Share of reviews with 4 or 5 stars, as a whole percent. */
export function happyShare(reviews) {
  if (!reviews.length) return 0;
  const happy = reviews.filter((review) => review.rating >= 4).length;
  return Math.round((happy / reviews.length) * 100);
}

const hasComment = (review) => Boolean(review.comment?.trim());

const time = (review) => new Date(review.createdAt).getTime() || 0;

/** Reviews after the star filter and the sort. */
export function visibleReviews(reviews, { stars = null, sort = "newest" }) {
  const list = stars
    ? reviews.filter((review) => review.rating === stars)
    : [...reviews];
  const byNewest = (a, b) => time(b) - time(a);
  if (sort === "highest") {
    return list.sort((a, b) => b.rating - a.rating || byNewest(a, b));
  }
  if (sort === "lowest") {
    return list.sort((a, b) => a.rating - b.rating || byNewest(a, b));
  }
  return list.sort(byNewest);
}

/** The newest review with a real comment and 4 or more stars. */
export function featuredReview(reviews) {
  return (
    visibleReviews(reviews, { sort: "newest" }).find(
      (review) => review.rating >= 4 && hasComment(review),
    ) || null
  );
}

/** "Sara K." from "Sara Khalil": the public page shows less of the name. */
export function reviewerName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return t("Guest");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

export function reviewerInitials(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "G";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** A stable tone (0 to 4) per reviewer, so avatars are not all the same. */
export function avatarTone(seed) {
  const text = String(seed ?? "");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % 5;
}

/** "Today", "3 days ago", "2 weeks ago", then a normal date. */
export function relativeDate(value, now = Date.now()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.floor((now - date.getTime()) / DAY_MS);
  if (days <= 0) return t("Today");
  if (days === 1) return t("Yesterday");
  if (days < 7) return t("{days} days ago", { days });
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? t("1 week ago") : t("{weeks} weeks ago", { weeks });
  }
  return date.toLocaleDateString(dateLocale(), {
    month: "short",
    year: "numeric",
  });
}

export function fullDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(dateLocale(), { dateStyle: "long" });
}
