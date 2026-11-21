/** Cards shown before "Show the whole team". */
export const TEAM_PREVIEW_COUNT = 6;
/** Skills shown on a card before "+N". */
export const CARD_SKILL_COUNT = 4;
/** Services named on a card before "+N more". */
export const CARD_SERVICE_COUNT = 3;
/** Bios longer than this get "Read more". */
export const BIO_PREVIEW_LENGTH = 140;
/** The specialty filter shows only for a team of this size or more. */
const FILTER_MIN_TEAM = 4;

export const ALL_SPECIALTIES = "ALL";

export function initials(name) {
  return (name || "Salon professional")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function firstName(name) {
  return (name || "").trim().split(/\s+/)[0] || "this professional";
}

export const specialtyOf = (employee) =>
  employee.specialty?.trim() || "Salon professional";

/** Short facts for the line above the team: people, years, services. */
export function teamSummary(employees) {
  const years = employees.reduce(
    (sum, employee) => sum + (Number(employee.yearsOfExperience) || 0),
    0,
  );
  const services = new Set(
    employees.flatMap((employee) => employee.serviceIds || []),
  );
  return {
    people: employees.length,
    years,
    services: services.size,
  };
}

/** Specialty chips, most common first; none for a small or uniform team. */
export function specialtyFilters(employees) {
  if (employees.length < FILTER_MIN_TEAM) return [];
  const counts = new Map();
  employees.forEach((employee) => {
    const specialty = specialtyOf(employee);
    counts.set(specialty, (counts.get(specialty) || 0) + 1);
  });
  if (counts.size < 2) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

export const plural = (count, one, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;
