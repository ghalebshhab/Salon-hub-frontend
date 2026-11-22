import { formatMoney, toFils } from "../../payments/model/payment.js";
import { formatDuration } from "../../bookings/model/booking.js";
import t from "../../../shared/i18n/t.js";

/** Search and sort show only for a menu of this size or more. */
export const MENU_TOOLS_MIN = 6;
/** The wizard books at most this many services in one visit. */
export const MAX_SERVICES_PER_VISIT = 10;

export const MENU_SORTS = [
  { value: "salon", label: t("Salon's order") },
  { value: "price-asc", label: t("Price: low to high") },
  { value: "price-desc", label: t("Price: high to low") },
  { value: "duration", label: t("Shortest first") },
];

const priceOf = (service) => Number(service.price) || 0;
const minutesOf = (service) => Number(service.durationMinutes) || 0;

export const servicePrice = (service) => formatMoney(toFils(service.price));
export const serviceDuration = (service) => formatDuration(minutesOf(service));

/** Services that match the search, in the chosen order. */
export function visibleServices(services, { query = "", sort = "salon" }) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = words.length
    ? services.filter((service) => {
        const text = [
          service.name,
          service.description,
          service.nameAr,
          service.descriptionAr,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return words.every((word) => text.includes(word));
      })
    : services;
  const sorted = [...matches];
  if (sort === "price-asc") sorted.sort((a, b) => priceOf(a) - priceOf(b));
  if (sort === "price-desc") sorted.sort((a, b) => priceOf(b) - priceOf(a));
  if (sort === "duration") sorted.sort((a, b) => minutesOf(a) - minutesOf(b));
  return sorted;
}

/** "From 5 JOD · 15 min to 2 h" for the line above the menu. */
export function menuSummary(services) {
  if (!services.length) return null;
  const prices = services.map(priceOf);
  const minutes = services.map(minutesOf).filter(Boolean);
  return {
    count: services.length,
    fromPrice: formatMoney(toFils(Math.min(...prices))),
    shortest: minutes.length ? formatDuration(Math.min(...minutes)) : null,
    longest: minutes.length ? formatDuration(Math.max(...minutes)) : null,
  };
}

/** Total price and time of the chosen services. */
export function selectionTotals(services) {
  return {
    count: services.length,
    price: formatMoney(
      services.reduce((sum, service) => sum + toFils(service.price), 0),
    ),
    duration: formatDuration(
      services.reduce((sum, service) => sum + minutesOf(service), 0),
    ),
  };
}
