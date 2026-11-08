import { describe, expect, it } from "vitest";
import {
  cityFromAddressComponents,
  googleMapsLink,
  isInsideJordan,
} from "./jordanMapLocation.js";

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
