/** Conversation helpers for Lamsa, the Salonhub assistant. */

export const MAX_STORED_MESSAGES = 40;
export const HISTORY_TURNS = 12;
export const MAX_MESSAGE_LENGTH = 500;

let sequence = 0;
const nextId = () => `m${Date.now().toString(36)}${(sequence += 1)}`;

export function userMessage(text) {
  return { id: nextId(), role: "user", text };
}

export function assistantMessage(data, pages = []) {
  return {
    id: nextId(),
    role: "assistant",
    text: data.reply,
    mode: data.mode,
    intent: data.intent,
    salons: data.salons ?? [],
    jobs: data.jobs ?? [],
    candidates: data.candidates ?? [],
    rankings: data.rankings ?? [],
    links: mergeLinks(data.links ?? [], pages),
    suggestions: data.suggestions ?? [],
  };
}

export function errorMessage(text) {
  return { id: nextId(), role: "assistant", text, error: true };
}

/** Earlier turns in the shape the API expects, newest last. */
export function toHistory(messages) {
  return messages
    .filter((message) => !message.error && message.text)
    .slice(-HISTORY_TURNS)
    .map(({ role, text }) => ({ role, text }));
}

const STOP_WORDS = new Set(
  "a an and are can do does find for go how i in is it me my of on open page please show take the to want what where with you".split(
    " ",
  ),
);

const tokens = (text) =>
  String(text ?? "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

/**
 * Pages whose title or keywords share words with the message. Words match
 * at their start, so "book" finds "My bookings". Best matches first.
 */
export function matchPages(pages, text, limit = 3) {
  const words = tokens(text);
  if (!words.length) return [];
  return pages
    .map((page) => {
      const haystack = tokens([page.title, ...(page.keywords ?? [])].join(" "));
      const score = words.filter((word) =>
        haystack.some((candidate) => candidate.startsWith(word)),
      ).length;
      return { page, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ page }) => ({
      label: page.title,
      to: page.to,
      description: page.subtitle,
    }));
}

/** Server links first, then page matches, one per destination. */
export function mergeLinks(links, pages, limit = 4) {
  const seen = new Set();
  return [...links, ...pages]
    .filter((link) => {
      // "/#discover" and "/" open the same page.
      const page = link?.to?.split("#")[0] || link?.to;
      if (!page || seen.has(page)) return false;
      seen.add(page);
      return true;
    })
    .slice(0, limit);
}

export function storageKey(userId) {
  return `salonhub_assistant_${userId ?? "guest"}`;
}

export function loadMessages(key) {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(key) ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function saveMessages(key, messages) {
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
    );
  } catch {
    // Storage can be full or blocked; the chat still works in memory.
  }
}

/** Starter prompts that fit the viewer. */
export function starterPrompts({ loggedIn, isOwner }) {
  if (isOwner) {
    return [
      "Find employees for my salon",
      "Top rated salons",
      "How do I create a hiring post?",
      "What can you do?",
    ];
  }
  return [
    "Top rated salons",
    "Best salons in Amman",
    loggedIn ? "Open jobs for me" : "Open jobs in Irbid",
    "How do I book?",
  ];
}
