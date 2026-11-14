import httpClient from "../../../shared/api/httpClient.js";

const payload = (response) => response.data;

/** Sends one message with the earlier turns; the server keeps no chat. */
export async function sendAssistantMessageApi(
  { message, history = [], page },
  config = {},
) {
  return payload(
    await httpClient.post(
      "/assistant/chat",
      { message, history, page },
      config,
    ),
  );
}

/** Top salons per governorate and an opportunity for the current viewer. */
export async function getAssistantInsightsApi(config = {}) {
  return payload(await httpClient.get("/assistant/insights", config));
}
