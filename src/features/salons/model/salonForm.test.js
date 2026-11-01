import { expect, it } from "vitest";
import { fromSalonResponse, toSalonPayload } from "./salonForm.js";

it("maps the salon form to the backend create contract", () => {
  expect(
    toSalonPayload({
      name: " Test ",
      description: " A salon ",
      phoneNumber: " 123 ",
      email: " a@b.com ",
      city: "Amman",
      maxNumOfEmployees: "3",
      openTime: "09:00:00",
      closeTime: "18:00:00",
      profilePictureUrl: " https://example.com/a.png ",
      googleMapsUrl: " https://www.google.com/maps/@31.9539,35.9106,17z ",
      latitude: "31.9539",
      longitude: "35.9106",
    }),
  ).toEqual({
    salonName: "Test",
    salonDescription: "A salon",
    salonPhoneNumber: "123",
    salonEmail: "a@b.com",
    salonCity: "Amman",
    googleMapsUrl: "https://www.google.com/maps/@31.9539,35.9106,17z",
    latitude: 31.9539,
    longitude: 35.9106,
    maxNumberOfEmployees: 3,
    openingTime: "09:00:00",
    closingTime: "18:00:00",
    profilePictureUrl: "https://example.com/a.png",
  });
});

it("maps the backend salon response to the frontend view model", () => {
  const salon = fromSalonResponse({
    id: 7,
    salonName: "Test",
    salonEmail: "a@b.com",
    salonPhoneNumber: "123",
    location: "Amman",
    googleMapsUrl: "https://www.google.com/maps/@31.9539,35.9106,17z",
    latitude: 31.9539,
    longitude: 35.9106,
    currentEmployeesNumber: 2,
    maxEmployeesNumber: 4,
    profilePictureUrl: "https://example.com/a.png",
    openingTime: "09:00:00",
    closingTime: "18:00:00",
  });
  expect(salon).toMatchObject({
    salonId: 7,
    name: "Test",
    email: "a@b.com",
    city: "Amman",
    googleMapsUrl: "https://www.google.com/maps/@31.9539,35.9106,17z",
    latitude: 31.9539,
    longitude: 35.9106,
    currentNumOfEmployees: 2,
    maxNumOfEmployees: 4,
    images: ["https://example.com/a.png"],
  });
});
