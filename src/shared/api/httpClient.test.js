import { afterEach, describe, expect, it } from "vitest";
import http, { loadingMessageFor } from "./httpClient.js";
import { clearAuthData, isLoggedIn } from "../auth/tokenStorage.js";
import { signInForTest } from "../../test/session.js";
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
  const ok = (config) => ({
    config,
    data: { success: true, data: null },
    headers: {},
    status: 200,
    statusText: "OK",
  });
  // Answers the token refresh call (it does not use a per-request adapter).
  const answerRefresh = (succeeds) => {
    const calls = [];
    http.defaults.adapter = async (config) => {
      calls.push(config.url);
      if (succeeds) return ok(config);
      throw { config, response: { status: 401 } };
    };
    return calls;
  };

  afterEach(() => {
    delete http.defaults.adapter;
    clearAuthData();
  });

  it("sends the cookies and the CSRF header, never a token header", async () => {
    signInForTest();
    await http.post(
      "/bookings",
      {},
      {
        adapter: async (config) => {
          expect(config.withCredentials).toBe(true);
          expect(config.headers["X-Requested-With"]).toBe("XMLHttpRequest");
          expect(config.headers.Authorization).toBeUndefined();
          return ok(config);
        },
      },
    );
  });

  it("refreshes the session once on 401 and repeats the request", async () => {
    signInForTest();
    const refreshCalls = answerRefresh(true);
    let attempts = 0;
    const response = await http.get("/bookings/my", {
      adapter: async (config) => {
        attempts += 1;
        if (attempts === 1) throw { config, response: { status: 401 } };
        return ok(config);
      },
    });

    expect(response.data.success).toBe(true);
    expect(attempts).toBe(2);
    expect(refreshCalls).toEqual(["/auth/refresh"]);
    expect(isLoggedIn()).toBe(true);
  });

  it("signs out on this device when the refresh also fails", async () => {
    signInForTest();
    answerRefresh(false);
    await expect(
      http.get("/bookings/my", { adapter: fail(401) }),
    ).rejects.toBeDefined();
    expect(isLoggedIn()).toBe(false);
  });

  it("does not refresh for public requests, forbidden requests or failed logins", async () => {
    signInForTest();
    const refreshCalls = answerRefresh(true);
    await expect(
      http.get("/salons/1", { skipAuth: true, adapter: fail(401) }),
    ).rejects.toBeDefined();
    await expect(
      http.get("/owner", { adapter: fail(403) }),
    ).rejects.toBeDefined();
    await expect(
      http.post("/auth/login", {}, { adapter: fail(401) }),
    ).rejects.toBeDefined();

    expect(refreshCalls).toEqual([]);
    expect(isLoggedIn()).toBe(true);
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
    expect(loadingMessageFor({ method: "post", url: "/auth/login" })).toBe(
      "Signing you in…",
    );
    expect(loadingMessageFor({ method: "post", url: "/auth/logout" })).toBe(
      "Signing you out…",
    );
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
      loadingMessageFor({ method: "post", url: "/auth/password/change" }),
    ).toBe("Changing your password securely…");
    expect(loadingMessageFor({ method: "post", url: "/employment/join" })).toBe(
      "Sending your join request…",
    );
    expect(
      loadingMessageFor({
        method: "post",
        url: "/employment/leave/accept/12",
      }),
    ).toBe("Confirming the employee release…");
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
