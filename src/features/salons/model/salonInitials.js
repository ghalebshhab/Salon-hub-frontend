// Up to two uppercase initials for a salon name, used by cover placeholders.
export function salonInitials(name) {
  const words = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "S";
  const letters =
    words.length === 1
      ? [...words[0]].slice(0, 1)
      : [[...words[0]][0], [...words[words.length - 1]][0]];
  return letters.join("").toLocaleUpperCase();
}
