import { beforeEach, expect, it, vi } from "vitest";
import httpClient from "../../../shared/api/httpClient.js";
import { saveToken } from "../../../shared/auth/tokenStorage.js";
import {
  uploadSalonCoverApi,
  uploadSalonCoverFromDriveApi,
} from "./mediaApi.js";

beforeEach(() => saveToken("owner-test-token"));

it("preserves authentication, cancellation and progress options for both cover sources", async () => {
  const requests = [];
  httpClient.defaults.adapter = vi.fn(async (config) => {
    requests.push(config);
    return {
      config,
      status: 200,
      statusText: "OK",
      headers: {},
      data: { success: true },
    };
  });
  const controller = new AbortController();
  const onUploadProgress = vi.fn();
  const config = {
    signal: controller.signal,
    onUploadProgress,
    showLoading: false,
    timeout: 120000,
  };
  const file = new File(["picture"], "cover.png", { type: "image/png" });
  await uploadSalonCoverApi(file, config);
  await uploadSalonCoverFromDriveApi(
    "https://drive.google.com/file/d/abc/view",
    config,
  );

  expect(requests).toHaveLength(2);
  for (const request of requests) {
    expect(request.signal).toBe(controller.signal);
    expect(request.onUploadProgress).toBe(onUploadProgress);
    expect(request.timeout).toBe(120000);
    expect(request.showLoading).toBe(false);
    expect(request.salonHubLoadingId).toBeUndefined();
    expect(request.headers.Authorization).toBe("Bearer owner-test-token");
  }
  expect(requests[0].url).toBe("/media/salon-cover");
  expect(requests[0].data.get("file")).toBe(file);
  expect(requests[1].url).toBe("/media/salon-cover/drive");
  expect(JSON.parse(requests[1].data)).toEqual({
    url: "https://drive.google.com/file/d/abc/view",
  });
});
