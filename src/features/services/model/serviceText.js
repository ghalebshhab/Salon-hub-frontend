import localized from "../../../shared/i18n/localized.js";

/** The service name in the current language. */
export const serviceName = (service) =>
  localized(service?.name, service?.nameAr);

/** The service description in the current language. */
export const serviceDescription = (service) =>
  localized(service?.description, service?.descriptionAr);
