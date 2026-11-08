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

export function formatPostDate(value, locale) {
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
  if (member.relationship === "ACCEPTED") return "Friend";
  if (member.incomingRequest) return "Requested you";
  return "Pending";
}
