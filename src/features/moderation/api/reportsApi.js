import httpClient from "../../../shared/api/httpClient.js";

export async function createReportApi(report) {
  return (await httpClient.post("/reports", report)).data;
}
