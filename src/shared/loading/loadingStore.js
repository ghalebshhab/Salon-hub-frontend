let sequence = 0;
const requests = new Map();
const listeners = new Set();
let snapshot = { active: false, count: 0, message: "" };

function publish() {
  const messages = [...requests.values()];
  snapshot = {
    active: messages.length > 0,
    count: messages.length,
    message: messages.at(-1) || "Working on your request…",
  };
  listeners.forEach((listener) => listener());
}

export function startLoading(message = "Working on your request…") {
  const requestId = ++sequence;
  requests.set(requestId, message);
  publish();
  return requestId;
}

export function stopLoading(requestId) {
  if (!requests.delete(requestId)) return;
  publish();
}

export const getLoadingSnapshot = () => snapshot;

export function subscribeLoading(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetLoadingForTests() {
  requests.clear();
  publish();
}
