import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import { sendAssistantMessageApi } from "../api/assistantApi.js";
import AssistantContext from "./assistantContext.js";
import {
  MAX_MESSAGE_LENGTH,
  assistantMessage,
  errorMessage,
  loadMessages,
  matchPages,
  saveMessages,
  storageKey,
  toHistory,
  userMessage,
} from "../model/assistantConversation.js";

/**
 * One conversation per browser tab and member, shared by the floating panel
 * and the full assistant page. `pages` lists the pages the viewer can open;
 * the app passes it in so the feature does not depend on the app layer.
 */
export default function AssistantProvider({ userId, pages = [], children }) {
  const key = storageKey(userId);
  const { pathname } = useLocation();
  const [conversation, setConversation] = useState(() => ({
    key,
    messages: loadMessages(key),
  }));
  const [pending, setPending] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const requestRef = useRef(null);

  // A different member in the same tab starts from their own stored chat.
  const messages =
    conversation.key === key ? conversation.messages : loadMessages(key);
  if (conversation.key !== key) {
    setConversation({ key, messages });
  }

  useEffect(() => {
    saveMessages(conversation.key, conversation.messages);
  }, [conversation]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const append = useCallback(
    (message) =>
      setConversation((current) => ({
        ...current,
        messages: [...current.messages, message],
      })),
    [],
  );

  const send = useCallback(
    async (rawText) => {
      const text = String(rawText ?? "")
        .trim()
        .slice(0, MAX_MESSAGE_LENGTH);
      if (!text || pending) return;

      const history = toHistory(messages);
      append(userMessage(text));
      setPending(true);
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;

      try {
        const response = await sendAssistantMessageApi(
          { message: text, history, page: pathname },
          { signal: controller.signal },
        );
        if (response?.success === false || !response?.data) {
          append(errorMessage(response?.message || "Lamsa could not answer."));
        } else {
          append(assistantMessage(response.data, matchPages(pages, text)));
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        append(
          errorMessage(
            getApiErrorMessage(error, "Lamsa could not answer. Try again."),
          ),
        );
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null;
          setPending(false);
        }
      }
    },
    [append, messages, pages, pathname, pending],
  );

  const reset = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    setPending(false);
    setConversation((current) => ({ ...current, messages: [] }));
  }, []);

  const value = useMemo(
    () => ({
      messages,
      pending,
      send,
      reset,
      panelOpen,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      togglePanel: () => setPanelOpen((open) => !open),
    }),
    [messages, pending, send, reset, panelOpen],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
