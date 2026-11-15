import { describe, expect, it } from "vitest";
import {
  cityFromAddressComponents,
  coordinatesFromMapsInput,
  googleMapsDirectionsLink,
  googleMapsEmbedUrl,
  googleMapsLink,
  isInsideJordan,
  toLocationFields,
  toMapPoint,
} from "./jordanMapLocation.js";

describe("map input parsing", () => {
  it.each([
    ["31.9539, 35.9106", { lat: 31.9539, lng: 35.9106 }],
    [
      "https://www.google.com/maps/place/Salon/@31.95,35.91,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d31.9561!4d35.9123",
      { lat: 31.9561, lng: 35.9123 },
    ],
    [
      "https://www.google.com/maps/@32.5556,35.85,15z",
      { lat: 32.5556, lng: 35.85 },
    ],
    [
      "https://www.google.com/maps/search/?api=1&query=29.5321,35.0063",
      { lat: 29.5321, lng: 35.0063 },
    ],
    ["https://maps.google.com/?q=31.9,%2035.9", { lat: 31.9, lng: 35.9 }],
  ])("reads a point from %s", (input, expected) => {
    expect(coordinatesFromMapsInput(input)).toEqual(expected);
  });

  it.each([
    "",
    "https://maps.app.goo.gl/AbCdEf",
    "48.8566, 2.3522",
    "salon in amman",
  ])("returns null for %s", (input) => {
    expect(coordinatesFromMapsInput(input)).toBeNull();
  });
});

describe("map points and links", () => {
  it("accepts only complete points inside Jordan", () => {
    expect(toMapPoint("31.95", "35.91")).toEqual({ lat: 31.95, lng: 35.91 });
    expect(toMapPoint("", "35.91")).toBeNull();
    expect(toMapPoint(null, null)).toBeNull();
    expect(toMapPoint(0, 0)).toBeNull();
  });

  it("builds rounded form fields with the canonical link", () => {
    expect(toLocationFields({ lat: 31.953912345678, lng: 35.91 })).toEqual({
      latitude: 31.9539123,
      longitude: 35.91,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=31.9539123,35.91",
    });
  });

  it("builds directions and embed links", () => {
    expect(googleMapsDirectionsLink(31.9, 35.9)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=31.9,35.9",
    );
    expect(googleMapsEmbedUrl(31.9, 35.9)).toBe(
      "https://maps.google.com/maps?q=31.9%2C35.9&z=16&output=embed",
    );
    expect(googleMapsEmbedUrl(31.9, 35.9, "KEY")).toBe(
      "https://www.google.com/maps/embed/v1/place?key=KEY&q=31.9%2C35.9&zoom=16",
    );
  });
});

describe("Jordan map location", () => {
  it("accepts Jordan coordinates and rejects coordinates outside the API boundary", () => {
    expect(isInsideJordan(31.9539, 35.9106)).toBe(true);
    expect(isInsideJordan(33.9, 35.5)).toBe(false);
  });

  it("creates the canonical Google Maps selection link", () => {
    expect(googleMapsLink(31.9539, 35.9106)).toBe(
      "https://www.google.com/maps/search/?api=1&query=31.9539,35.9106",
    );
  });

  it("maps Google address components to supported salon cities", () => {
    expect(
      cityFromAddressComponents([
        {
          long_name: "Amman Governorate",
          types: ["administrative_area_level_1"],
        },
      ]),
    ).toBe("Amman");
  });
});
