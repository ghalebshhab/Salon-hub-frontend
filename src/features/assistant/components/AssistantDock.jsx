import { Maximize2, RotateCcw, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAssistant from "../hooks/useAssistant.js";
import useLamsaGreeting from "../hooks/useLamsaGreeting.js";
import { ASSISTANT_PATH } from "../model/assistantRoutes.js";
import AssistantConversation from "./AssistantConversation.jsx";
import LamsaOrb from "./LamsaOrb.jsx";
import { ASSISTANT_NAME, ASSISTANT_ROLE } from "../model/assistantIdentity.js";

/**
 * Floating launcher and small chat panel, available on every page. The
 * panel is a non-modal dialog: the page behind it stays usable.
 */
export default function AssistantDock() {
  const { panelOpen, togglePanel, openPanel, closePanel, reset, messages } =
    useAssistant();
  const greeting = useLamsaGreeting({
    panelOpen,
    hasMessages: messages.length > 0,
  });
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!panelOpen) {
      if (wasOpen.current) launcherRef.current?.focus();
      wasOpen.current = false;
      return undefined;
    }
    wasOpen.current = true;
    const onKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        panelRef.current?.contains(document.activeElement)
      ) {
        closePanel();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panelOpen, closePanel]);

  return (
    <div className={`lamsa-dock ${panelOpen ? "is-open" : ""}`.trim()}>
      {panelOpen && (
        <section
          ref={panelRef}
          className="lamsa-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="lamsa-panel-title"
        >
          <header className="lamsa-panel-header">
            <LamsaOrb size="md" animated className="lamsa-panel-orb" />
            <div>
              <h2 id="lamsa-panel-title">
                {ASSISTANT_NAME} <span className="lamsa-ai-badge">AI</span>
              </h2>
              <p>
                <span className="lamsa-live-dot" aria-hidden="true" />
                {ASSISTANT_ROLE}
              </p>
            </div>
            <div className="lamsa-panel-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Start a new chat"
                  title="New chat"
                >
                  <RotateCcw aria-hidden="true" />
                </button>
              )}
              <Link
                to={ASSISTANT_PATH}
                onClick={closePanel}
                aria-label="Open the full assistant page"
                title="Full page"
              >
                <Maximize2 aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={closePanel}
                aria-label={`Close ${ASSISTANT_NAME}`}
                title="Close"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          </header>
          <AssistantConversation compact autoFocus onNavigate={closePanel} />
        </section>
      )}
      {greeting.visible && (
        <div className="lamsa-greeting" role="status">
          <button
            type="button"
            className="lamsa-greeting-body"
            onClick={() => {
              greeting.dismiss();
              openPanel();
            }}
          >
            <strong>Hi there! I am {ASSISTANT_NAME}, your AI guide.</strong>
            <span>Ask me for the best salons near you, jobs, or help.</span>
          </button>
          <button
            type="button"
            className="lamsa-greeting-close"
            onClick={greeting.dismiss}
            aria-label="Hide the greeting"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      )}
      <button
        ref={launcherRef}
        type="button"
        className="lamsa-launcher"
        onClick={() => {
          greeting.dismiss();
          togglePanel();
        }}
        aria-expanded={panelOpen}
        aria-label={
          panelOpen
            ? `Close ${ASSISTANT_NAME}`
            : `Ask ${ASSISTANT_NAME}, the ${ASSISTANT_ROLE}`
        }
      >
        {panelOpen ? (
          <span className="lamsa-launcher-close" aria-hidden="true">
            <X />
          </span>
        ) : (
          <LamsaOrb
            size="launcher"
            animated
            live
            className="lamsa-launcher-orb"
          />
        )}
        <span className="lamsa-launcher-label" aria-hidden="true">
          <span className="lamsa-launcher-text">
            <strong>Ask {ASSISTANT_NAME}</strong>
            <small>AI assistant</small>
          </span>
          <span className="lamsa-ai-badge">AI</span>
        </span>
      </button>
    </div>
  );
}
