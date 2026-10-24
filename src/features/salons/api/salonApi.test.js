import { beforeEach, expect, it, vi } from "vitest";
import http from "../../../shared/api/httpClient.js";
import { saveToken } from "../../../shared/auth/tokenStorage.js";
import {
  getAllSalonsApi,
  resubmitSalonApi,
  updateSalonApi,
} from "./salonApi.js";

const requests = [];

beforeEach(() => {
  requests.length = 0;
  saveToken("owner-token");
  http.defaults.adapter = vi.fn(async (config) => {
    requests.push(config);
    return {
      config,
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        success: true,
        data: config.url === "/salons/active" ? [] : { id: 7 },
      },
    };
  });
});

it("loads the community directory from the public active-salons endpoint", async () => {
  await getAllSalonsApi();

  expect(requests[0]).toMatchObject({ method: "get", url: "/salons/active" });
});

it("updates and resubmits the authenticated owner's salon", async () => {
  await updateSalonApi(7, { salonName: "Updated Salon" });
  await resubmitSalonApi(7);

  expect(requests[0]).toMatchObject({
    method: "put",
    url: "/salons/7/edit",
  });
  expect(JSON.parse(requests[0].data)).toEqual({
    salonName: "Updated Salon",
  });
  expect(requests[1]).toMatchObject({
    method: "post",
    url: "/salons/7/resubmit",
  });
  expect(requests[1].headers.Authorization).toBe("Bearer owner-token");
});
