import { RotateCcw } from "lucide-react";
import AssistantConversation from "../components/AssistantConversation.jsx";
import LamsaBackdrop from "../components/LamsaBackdrop.jsx";
import LamsaOrb from "../components/LamsaOrb.jsx";
import useAssistant from "../hooks/useAssistant.js";
import { ASSISTANT_NAME, ASSISTANT_ROLE } from "../model/assistantIdentity.js";

/**
 * Full-page chat. One calm stage over a living backdrop: an identity bar,
 * then the welcome (or the conversation), and a floating composer.
 */
export default function AssistantPage() {
  const { reset, messages, pending } = useAssistant();
  const started = messages.length > 0;

  return (
    <div className="lamsa-page container">
      <section
        className={`lamsa-stage ${started ? "has-messages" : ""}`.trim()}
        aria-label={`Chat with ${ASSISTANT_NAME}`}
      >
        <LamsaBackdrop thinking={pending} />
        <header className="lamsa-stage-bar">
          <LamsaOrb size="md" animated={pending} live={pending} />
          <div className="lamsa-stage-title">
            <h1>
              {ASSISTANT_NAME}
              <span className="lamsa-ai-badge">AI</span>
            </h1>
            <p>
              <span className="lamsa-live-dot" aria-hidden="true" />
              {pending ? "Writing…" : `Online · ${ASSISTANT_ROLE}`}
            </p>
          </div>
          {started && (
            <button
              type="button"
              className="lamsa-stage-reset"
              onClick={reset}
              aria-label="Start a new chat"
            >
              <RotateCcw aria-hidden="true" />
              <span>New chat</span>
            </button>
          )}
        </header>
        <AssistantConversation variant="page" autoFocus />
      </section>
    </div>
  );
}
