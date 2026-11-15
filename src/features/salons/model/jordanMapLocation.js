export const JORDAN_MAP_BOUNDS = {
  north: 33.5,
  south: 29,
  east: 39.4,
  west: 34.8,
};

const CITY_ALIASES = new Map([
  ["amman", "Amman"],
  ["zarqa", "Zarqa"],
  ["az zarqa", "Zarqa"],
  ["irbid", "Irbid"],
  ["aqaba", "Aqaba"],
  ["al aqabah", "Aqaba"],
  ["jerash", "Jerash"],
  ["jarash", "Jerash"],
  ["madaba", "Madaba"],
  ["ajloun", "Ajloun"],
  ["ajlun", "Ajloun"],
  ["as-salt", "As-Salt"],
  ["as salt", "As-Salt"],
  ["salt", "As-Salt"],
  ["al-karak", "Al-Karak"],
  ["al karak", "Al-Karak"],
  ["karak", "Al-Karak"],
  ["ma'an", "Ma'an"],
  ["maan", "Ma'an"],
  ["tafilah", "Tafilah"],
  ["at tafilah", "Tafilah"],
  ["mafraq", "Mafraq"],
  ["al mafraq", "Mafraq"],
]);

export function isInsideJordan(latitude, longitude) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= JORDAN_MAP_BOUNDS.south &&
    latitude <= JORDAN_MAP_BOUNDS.north &&
    longitude >= JORDAN_MAP_BOUNDS.west &&
    longitude <= JORDAN_MAP_BOUNDS.east
  );
}

export const DEFAULT_MAP_CENTER = { lat: 31.9539, lng: 35.9106 };
const COORDINATE_DIGITS = 7;

export function googleMapsLink(latitude, longitude) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function googleMapsDirectionsLink(latitude, longitude) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

/** Driving route between two points; Google Maps shows the live travel time. */
export function googleMapsRouteLink(origin, destination) {
  const parameters = new URLSearchParams({
    api: "1",
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${parameters}`;
}

/**
 * URL for an embedded Google Map. With an API key it uses the official Maps
 * Embed API; without one it falls back to the public embed endpoint, which
 * needs no key, so guests always see the map.
 */
export function googleMapsEmbedUrl(latitude, longitude, apiKey = "") {
  const query = `${latitude},${longitude}`;
  if (apiKey) {
    const parameters = new URLSearchParams({
      key: apiKey,
      q: query,
      zoom: "16",
    });
    return `https://www.google.com/maps/embed/v1/place?${parameters}`;
  }
  const parameters = new URLSearchParams({
    q: query,
    z: "16",
    output: "embed",
  });
  return `https://maps.google.com/maps?${parameters}`;
}

/** Returns `{ lat, lng }` when both values form a valid point in Jordan, else null. */
export function toMapPoint(latitude, longitude) {
  if (
    latitude === "" ||
    latitude == null ||
    longitude === "" ||
    longitude == null
  )
    return null;
  const lat = Number(latitude);
  const lng = Number(longitude);
  return isInsideJordan(lat, lng) ? { lat, lng } : null;
}

/** Builds the location fields the salon form and API expect from a map point. */
export function toLocationFields({ lat, lng }) {
  const latitude = Number(lat.toFixed(COORDINATE_DIGITS));
  const longitude = Number(lng.toFixed(COORDINATE_DIGITS));
  return {
    latitude,
    longitude,
    googleMapsUrl: googleMapsLink(latitude, longitude),
  };
}

const NUMBER = "(-?\\d{1,3}(?:\\.\\d+)?)";
const MAPS_URL_PATTERNS = [
  // Exact place pin: ...!3d31.95!4d35.91
  new RegExp(`!3d${NUMBER}!4d${NUMBER}`),
  // Camera position: /@31.95,35.91,17z
  new RegExp(`@${NUMBER},${NUMBER}`),
  // Query parameters: ?q=31.95,35.91 or &query=... or &destination=...
  new RegExp(`[?&](?:q|query|destination|ll)=${NUMBER},(?:\\s|%20)*${NUMBER}`),
];

/** Reads coordinates from a pasted Google Maps link or a "lat, lng" text. */
export function coordinatesFromMapsInput(value = "") {
  const text = value.trim();
  const plain = text.match(new RegExp(`^${NUMBER}\\s*,\\s*${NUMBER}$`));
  const match =
    plain || MAPS_URL_PATTERNS.map((p) => text.match(p)).find(Boolean);
  return match ? toMapPoint(match[1], match[2]) : null;
}

const componentName = (component) =>
  component?.longText ||
  component?.long_name ||
  component?.shortText ||
  component?.short_name ||
  "";

export function cityFromAddressComponents(components = []) {
  const preferredTypes = [
    "locality",
    "administrative_area_level_2",
    "administrative_area_level_1",
  ];

  for (const type of preferredTypes) {
    const component = components.find((item) => item.types?.includes(type));
    const normalized = componentName(component)
      .toLowerCase()
      .replace(/ governorate$/, "")
      .trim();
    if (CITY_ALIASES.has(normalized)) return CITY_ALIASES.get(normalized);
  }

  return "";
}
