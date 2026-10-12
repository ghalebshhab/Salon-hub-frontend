import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => {
  cleanup();
  if (typeof localStorage !== "undefined") localStorage.clear();
  if (typeof document !== "undefined") {
    document.cookie = "salonhub_session=; Path=/; Max-Age=0";
    document.cookie = "salonhub_theme=; Path=/; Max-Age=0";
  }
});
