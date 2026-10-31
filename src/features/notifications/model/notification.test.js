import { describe, expect, it } from "vitest";
import { getNotificationTitle } from "./notification.js";

describe("notification titles", () => {
  it("labels every salon lifecycle event clearly", () => {
    expect(getNotificationTitle("SALON_REQUEST_SUBMITTED")).toBe(
      "Salon request submitted",
    );
    expect(getNotificationTitle("SALON_REQUEST_RESUBMITTED")).toBe(
      "Salon request resubmitted",
    );
    expect(getNotificationTitle("SALON_REQUEST_ACCEPTED")).toBe(
      "Salon request accepted",
    );
    expect(getNotificationTitle("SALON_REQUEST_REJECTED")).toBe(
      "Salon request rejected",
    );
    expect(getNotificationTitle("SALON_BLOCKED")).toBe("Salon blocked");
    expect(getNotificationTitle("SALON_UNBLOCKED")).toBe("Salon restored");
  });
});
