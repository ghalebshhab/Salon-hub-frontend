import { afterEach, describe, expect, it } from "vitest";
import http, { loadingMessageFor } from "./httpClient.js";
import { getToken, saveToken } from "../auth/tokenStorage.js";
import { getApiErrorMessage, requireData } from "./response.js";
import {
  getLoadingSnapshot,
  resetLoadingForTests,
} from "../loading/loadingStore.js";
const fail = (status) => async (config) => {
  throw { config, response: { status } };
};

afterEach(resetLoadingForTests);

describe("HTTP authentication policy", () => {
  it("sends authentication to logout but not to public authentication flows", async () => {
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
    await http.post("/auth/email/verify", {}, { adapter: inspect(undefined) });
    await http.post("/auth/password/forgot", {}, { adapter: inspect(undefined) });
    await http.post("/auth/password/verify-code", {}, {
      adapter: inspect(undefined),
    });
    await http.post("/auth/password/reset", {}, { adapter: inspect(undefined) });
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
  it("prefers backend reasons and explains transport failures clearly", () => {
    expect(
      getApiErrorMessage({
        response: {
          status: 400,
          data: { success: false, message: "Selected time is unavailable" },
        },
      }),
    ).toBe("Selected time is unavailable");
    expect(getApiErrorMessage({ response: { status: 403, data: {} } })).toBe(
      "Your account does not have permission to perform this action.",
    );
    expect(getApiErrorMessage({ code: "ERR_NETWORK", request: {} })).toBe(
      "The server could not be reached. Check your connection and try again.",
    );
  });
  it("tracks foreground mutations and leaves background reads unobtrusive", async () => {
    const inspectMutation = async (config) => {
      expect(getLoadingSnapshot()).toMatchObject({
        active: true,
        message: "Accepting the booking…",
      });
      return {
        config,
        data: { success: true, data: null },
        headers: {},
        status: 200,
        statusText: "OK",
      };
    };

    await http.put("/bookings/10/accept", {}, { adapter: inspectMutation });
    expect(getLoadingSnapshot().active).toBe(false);

    await http.get("/notifications", {
      adapter: async (config) => {
        expect(getLoadingSnapshot().active).toBe(false);
        return { config, data: {}, headers: {}, status: 200, statusText: "OK" };
      },
    });
  });

  it("uses an action-specific loading message", () => {
    expect(
      loadingMessageFor({ method: "post", url: "/auth/login" }),
    ).toBe("Signing you in…");
    expect(
      loadingMessageFor({ method: "post", url: "/auth/logout" }),
    ).toBe("Signing you out…");
    expect(
      loadingMessageFor({ method: "post", url: "/auth/email/verify" }),
    ).toBe("Verifying your email…");
    expect(
      loadingMessageFor({ method: "post", url: "/auth/password/forgot" }),
    ).toBe("Sending password reset instructions…");
    expect(
      loadingMessageFor({ method: "post", url: "/auth/password/reset" }),
    ).toBe("Securing your new password…");
    expect(
      loadingMessageFor({ method: "put", url: "/bookings/10/accept" }),
    ).toBe("Accepting the booking…");
    expect(
      loadingMessageFor({
        method: "get",
        url: "/salons/active",
        params: { search: "Amman" },
      }),
    ).toBe("Searching SalonHub…");
  });
});
