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

export function googleMapsLink(latitude, longitude) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
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
