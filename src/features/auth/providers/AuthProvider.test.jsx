import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearAuthData, saveToken } from "../../../shared/auth/tokenStorage.js";
import useAuth from "../../../shared/auth/useAuth.js";
import AuthProvider from "./AuthProvider.jsx";

const loadProfile = async () => ({
  success: true,
  data: { id: 1, role: "OWNER" },
});
const wrapper = ({ children }) => (
  <AuthProvider loadProfile={loadProfile}>{children}</AuthProvider>
);

afterEach(clearAuthData);

describe("AuthProvider", () => {
  it("updates consumers on login and logout", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.loggedIn).toBe(false);

    act(() => saveToken("test-token"));
    expect(result.current.loggedIn).toBe(true);

    act(() => clearAuthData());
    expect(result.current.loggedIn).toBe(false);
  });

  it("loads the authenticated user role for owner-only experiences", async () => {
    saveToken("owner-token");
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.profileLoading).toBe(false));
    expect(result.current.isOwner).toBe(true);
    expect(result.current.role).toBe("OWNER");
  });
});
