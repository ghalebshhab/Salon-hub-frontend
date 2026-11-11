const PROFILE_ROLES = {
  OWNER: {
    label: "Salon owner",
    summary: "Building a salon, a team, and memorable client experiences.",
  },
  EMPLOYEE: {
    label: "Beauty professional",
    summary: "Practicing and growing their craft within the salon community.",
  },
  ADMIN: {
    label: "SalonHub team",
    summary: "Helping keep the SalonHub community useful and welcoming.",
  },
  USER: {
    label: "Community member",
    summary: "Discovering salons, professionals, and ideas across SalonHub.",
  },
};

export function getCommunityProfileRole(role) {
  return PROFILE_ROLES[String(role || "USER").toUpperCase()] || PROFILE_ROLES.USER;
}

export function getSalonRelationship(role) {
  return String(role || "").toUpperCase() === "OWNER"
    ? "Owns and leads"
    : "Works at";
}

export function getCommunityProfileViewModel(profile, currentUserId) {
  const user = profile.member.user;
  const displayName = user.displayName || user.userName;

  return {
    user,
    displayName,
    firstName: displayName.split(" ")[0],
    isSelf: Number(currentUserId) === Number(user.id),
    role: getCommunityProfileRole(profile.role),
    salonRelationship: getSalonRelationship(profile.role),
  };
}
