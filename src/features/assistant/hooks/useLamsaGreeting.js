import { useEffect, useState } from "react";

export const GREETING_SEEN_KEY = "salonhub_lamsa_greeting_seen";
export const GREETING_DELAY_MS = 3500;
export const GREETING_DURATION_MS = 12000;

function alreadySeen() {
  try {
    return window.sessionStorage.getItem(GREETING_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(GREETING_SEEN_KEY, "1");
  } catch {
    // Without storage the greeting may show again; that is harmless.
  }
}

/**
 * A short invitation next to the launcher, once per browser session, for
 * people who have not used Lamsa yet. It hides by itself after a while and
 * never shows while the chat is open or after the first message.
 */
export default function useLamsaGreeting({ panelOpen, hasMessages }) {
  const [visible, setVisible] = useState(false);
  const eligible = !panelOpen && !hasMessages;

  useEffect(() => {
    if (!eligible || alreadySeen()) return undefined;
    let hideTimer;
    const showTimer = window.setTimeout(() => {
      markSeen();
      setVisible(true);
      hideTimer = window.setTimeout(
        () => setVisible(false),
        GREETING_DURATION_MS,
      );
    }, GREETING_DELAY_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [eligible]);

  return {
    visible: visible && eligible,
    dismiss: () => setVisible(false),
  };
}
