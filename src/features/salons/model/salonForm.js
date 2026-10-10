export function toSalonPayload(form) {
  return {
    salonName: form.name.trim(),
    salonDescription: form.description.trim(),
    salonPhoneNumber: form.phoneNumber.trim(),
    salonEmail: form.email.trim(),
    salonCity: form.city,
    maxNumberOfEmployees: Number(form.maxNumOfEmployees),
    openingTime: form.openTime,
    closingTime: form.closeTime,
    profilePictureUrl: form.profilePictureUrl.trim() || null,
  };
}

export function fromSalonResponse(salon) {
  if (!salon) return null;

  const location = salon.location || salon.salonAddress || "";
  const profilePictureUrl = salon.profilePictureUrl || "";

  return {
    ...salon,
    salonId: salon.id ?? salon.salonId,
    name: salon.name ?? salon.salonName,
    phoneNumber: salon.salonPhoneNumber ?? salon.phoneNumber,
    email: salon.email ?? salon.salonEmail,
    city: location,
    address: location,
    description: salon.description ?? salon.salonDescription,
    openTime: salon.openingTime ?? salon.openTime,
    closeTime: salon.closingTime ?? salon.closeTime,
    currentNumOfEmployees:
      salon.currentEmployeesNumber ?? salon.currentNumOfEmployees ?? 0,
    maxNumOfEmployees: salon.maxEmployeesNumber ?? salon.maxNumOfEmployees ?? 0,
    images: profilePictureUrl ? [profilePictureUrl] : [],
    state: salon.openningStatus ?? salon.state ?? "CLOSED",
  };
}
