import { expect, it } from "vitest";
import { toSalonPayload } from "./salonForm.js";
it("preserves the backend Images field and employee invitation details without mutating the form", () => {
  const form = {
    name: " Test ",
    email: " a@b.com ",
    address: " Street ",
    phoneNumber: " 123 ",
    openTime: "09:00:00",
    closeTime: "18:00:00",
    city: " Amman ",
    state: "OPEN",
    maxNumOfEmployees: "3",
    Images: " https://example.com/a.png, , https://example.com/b.png ",
    employees: [
      {
        fullName: " A ",
        email: " a@b.com ",
        phoneNumber: " 123 ",
        imageUrl: "",
        specialty: " Barber ",
        startTime: "09:00:00",
        endTime: "18:00:00",
      },
    ],
  };
  const payload = toSalonPayload(form);
  expect(payload.Images).toEqual([
    "https://example.com/a.png",
    "https://example.com/b.png",
  ]);
  expect(payload.maxNumOfEmployees).toBe(3);
  expect(payload.currentNumOfEmployees).toBe(1);
  expect(payload.employees[0].fullName).toBe("A");
  expect(form.employees[0].fullName).toBe(" A ");
});
