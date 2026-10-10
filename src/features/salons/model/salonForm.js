export function toSalonPayload(form) {
  const imageUrls = form.Images
    ? form.Images.split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  return {
    name: form.name.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    phoneNumber: form.phoneNumber.trim(),
    openTime: form.openTime,
    closeTime: form.closeTime,
    city: form.city.trim(),
    state: form.state,
    maxNumOfEmployees: Number(form.maxNumOfEmployees || 0),
    currentNumOfEmployees: form.employees.length,
    Images: imageUrls,
    employees: form.employees.map((employee) => ({
      fullName: employee.fullName.trim(),
      email: employee.email.trim(),
      phoneNumber: employee.phoneNumber.trim(),
      imageUrl: employee.imageUrl.trim(),
      specialty: employee.specialty.trim(),
      startTime: employee.startTime,
      endTime: employee.endTime,
    })),
  };
}
