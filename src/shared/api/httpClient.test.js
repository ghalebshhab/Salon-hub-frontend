import { describe, expect, it } from "vitest";
import http from "./httpClient.js";
import { getToken, saveToken } from "../auth/tokenStorage.js";
import { requireData } from "./response.js";
const fail = (status) => async (config) => {
  throw { config, response: { status } };
};
describe("HTTP authentication policy", () => {
  it("sends authentication to logout but not to public login", async () => {
    saveToken("valid");
    const inspect = (expectedAuthorization) => async (config) => {
      expect(config.headers.Authorization).toBe(expectedAuthorization);
      return {
        config,
        data: { success: true, data: null },
        headers: {},
        status: 200,
        statusText: "OK",
      };
    };

    await http.post("/auth/login", {}, { adapter: inspect(undefined) });
    await http.post("/auth/logout", {}, { adapter: inspect("Bearer valid") });
  });

  it("attaches the token and clears an expired session on 401", async () => {
    saveToken("old");
    await expect(
      http.get("/bookings/my", { adapter: fail(401) }),
    ).rejects.toBeDefined();
    expect(getToken()).toBeNull();
  });
  it("keeps the session for forbidden requests and failed login attempts", async () => {
    saveToken("valid");
    await expect(
      http.get("/owner", { adapter: fail(403) }),
    ).rejects.toBeDefined();
    expect(getToken()).toBe("valid");
    await expect(
      http.post("/auth/login", {}, { adapter: fail(401) }),
    ).rejects.toBeDefined();
    expect(getToken()).toBe("valid");
  });
  it("does not clear a newer session for an old request", async () => {
    saveToken("old");
    await expect(
      http.get("/bookings/my", {
        adapter: async (config) => {
          saveToken("new");
          throw { config, response: { status: 401 } };
        },
      }),
    ).rejects.toBeDefined();
    expect(getToken()).toBe("new");
  });
  it("surfaces unsuccessful API envelopes", () => {
    expect(() =>
      requireData({ success: false, message: "Not available" }),
    ).toThrow("Not available");
    expect(requireData({ success: true, data: [1] })).toEqual([1]);
  });
});
