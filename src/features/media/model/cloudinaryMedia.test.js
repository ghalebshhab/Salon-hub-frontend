import { expect, it } from "vitest";
import { optimizedCloudinaryImage } from "./cloudinaryMedia.js";

it("adds safe automatic Cloudinary transformations to image delivery URLs", () => {
  expect(
    optimizedCloudinaryImage(
      "https://res.cloudinary.com/demo/image/upload/v1/salonhub/cover.jpg",
      { width: 900, height: 600 },
    ),
  ).toBe(
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_fill,g_auto,w_900,h_600/v1/salonhub/cover.jpg",
  );
});

it("leaves non-Cloudinary URLs unchanged", () => {
  expect(optimizedCloudinaryImage("https://example.com/image.jpg")).toBe(
    "https://example.com/image.jpg",
  );
});
