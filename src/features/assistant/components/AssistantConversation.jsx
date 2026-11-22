import {
  ArrowRight,
  ArrowUp,
  BriefcaseBusiness,
  CircleAlert,
  Compass,
  MessageCircleQuestion,
  Star,
  UsersRound,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import useAssistant from "../hooks/useAssistant.js";
import {
  MAX_MESSAGE_LENGTH,
  starterPrompts,
} from "../model/assistantConversation.js";
import {
  ASSISTANT_MEANING,
  ASSISTANT_NAME,
} from "../model/assistantIdentity.js";
import AssistantCards from "./AssistantCards.jsx";
import LamsaOrb from "./LamsaOrb.jsx";
import t from "../../../shared/i18n/t.js";

// The server puts the city name inside "Best salons in {city}".
function suggestionText(suggestion) {
  const city = String(suggestion).match(/^Best salons in (.+)$/);
  return city
    ? t("Best salons in {city}", { city: t(city[1]) })
    : t(suggestion);
}

function capabilities(isOwner) {
  return [
    {
      icon: Star,
      title: t("Top salons near you"),
      text: t("Best rated in every governorate"),
      prompt: "Top rated salons",
    },
    isOwner
      ? {
          icon: UsersRound,
          title: t("Grow your team"),
          text: t("Members open to work"),
          prompt: "Find employees for my salon",
        }
      : {
          icon: BriefcaseBusiness,
          title: t("Jobs that fit you"),
          text: t("Matched to your career profile"),
          prompt: "Open jobs for me",
        },
    {
      icon: Compass,
      title: t("Find any page"),
      text: t("Bookings, profile, settings"),
      prompt: "Where do I see my bookings?",
    },
    {
      icon: MessageCircleQuestion,
      title: t("How Salonhub works"),
      text: t("Booking, reviews, hiring"),
      prompt: "How does Salonhub work?",
    },
  ];
}

function greetingFor(firstName) {
  return firstName
    ? t("Welcome, {firstName}!", { firstName })
    : t("Welcome to Salonhub!");
}

/** Big welcome for the assistant page: who the assistant is, what to ask. */
function PageWelcome({ onPick }) {
  const { user, isOwner } = useAuth();
  return (
    <div className="lamsa-hero">
      <LamsaOrb size="xl" animated live />
      <h2>
        {greetingFor(user?.firstName)}
        <span>{t("How can I help today?")}</span>
      </h2>
      <p>
        {t(
          "{ASSISTANT_MEANING} I answer from live Salonhub data, so every salon, rating and job I show is real.",
          { ASSISTANT_MEANING },
        )}
      </p>
      <ul className="lamsa-capabilities">
        {capabilities(isOwner).map(({ icon: Icon, title, text, prompt }) => (
          <li key={title}>
            <button
              type="button"
              className="lamsa-capability"
              onClick={() => onPick(prompt)}
            >
              <span className="lamsa-capability-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="lamsa-capability-text">
                <strong>{t(title)}</strong>
                <small>{t(text)}</small>
              </span>
              <span className="lamsa-capability-prompt">
                “{t(prompt)}”
                <ArrowRight aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small welcome for the floating panel. */
function PanelWelcome({ onPick }) {
  const auth = useAuth();
  return (
    <div className="lamsa-welcome">
      <LamsaOrb size="lg" animated live />
      <h3>{greetingFor(auth.user?.firstName)}</h3>
      <p>
        {t(
          "Ask me for the best salons in your governorate, open jobs, people for your team, or how anything works.",
        )}
      </p>
      <div
        className="lamsa-starters"
        role="group"
        aria-label={t("Suggested questions")}
      >
        {starterPrompts(auth).map((prompt) => (
          <button type="button" key={prompt} onClick={() => onPick(prompt)}>
            {t(prompt)}
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message, last, onPick, onNavigate }) {
  if (message.role === "user") {
    return (
      <li className="lamsa-message is-user">
        <p className="lamsa-bubble">{t(message.text)}</p>
      </li>
    );
  }
  return (
    <li
      className={`lamsa-message is-assistant ${message.error ? "is-error" : ""}`.trim()}
    >
      {message.error ? (
        <span className="lamsa-avatar is-error" aria-hidden="true">
          <CircleAlert />
        </span>
      ) : (
        <LamsaOrb size="sm" className="lamsa-avatar" />
      )}
      <div className="lamsa-message-body">
        <span className="lamsa-message-name" aria-hidden="true">
          {ASSISTANT_NAME}
        </span>
        <p className="lamsa-bubble">
          <span className="sr-only">{ASSISTANT_NAME}: </span>
          {t(message.text)}
        </p>
        {!message.error && (
          <AssistantCards message={message} onNavigate={onNavigate} />
        )}
        {message.links?.length > 0 && (
          <nav className="lamsa-links" aria-label={t("Related pages")}>
            {message.links.map((link) => (
              <Link key={link.to} to={link.to} onClick={onNavigate}>
                <span>
                  <strong>{t(link.label)}</strong>
                  {link.description && <small>{t(link.description)}</small>}
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
        {last && message.suggestions?.length > 0 && (
          <div
            className="lamsa-suggestions"
            role="group"
            aria-label={t("Ask next")}
          >
            {message.suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => onPick(suggestion)}
              >
                {suggestionText(suggestion)}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function Composer({ onSend, pending, autoFocus, showHint }) {
  const [text, setText] = useState("");
  const inputId = useId();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim() || pending) return;
    onSend(text);
    setText("");
  };

  const remaining = MAX_MESSAGE_LENGTH - text.length;
  return (
    <form className="lamsa-composer" onSubmit={submit}>
      <label className="sr-only" htmlFor={inputId}>
        {t("Message {ASSISTANT_NAME}", { ASSISTANT_NAME })}
      </label>
      <textarea
        id={inputId}
        ref={inputRef}
        rows={1}
        value={text}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder={t("Ask {ASSISTANT_NAME} anything…", { ASSISTANT_NAME })}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            submit(event);
          }
        }}
      />
      {remaining <= 60 && (
        <span className="lamsa-counter" aria-live="polite">
          {remaining}
        </span>
      )}
      <button
        type="submit"
        className="lamsa-send"
        disabled={!text.trim() || pending}
        aria-label={t("Send message")}
      >
        <ArrowUp aria-hidden="true" />
      </button>
      {showHint && (
        <span className="lamsa-composer-hint" aria-hidden="true">
          <kbd>{t("Enter")}</kbd> {t("to send ·")} <kbd>{t("Shift")}</kbd> +{" "}
          <kbd>{t("Enter")}</kbd> {t("for a new line")}
        </span>
      )}
    </form>
  );
}

/**
 * The chat itself: messages, record cards and the composer.
 * variant="panel" is the floating panel, variant="page" the assistant page.
 */
export default function AssistantConversation({
  variant = "panel",
  autoFocus = false,
  onNavigate,
}) {
  const { messages, pending, send } = useAssistant();
  const scrollRef = useRef(null);
  const scrolled = useRef(false);
  const page = variant === "page";

  // Scroll only the message list; the page itself must not move. The first
  // scroll jumps to the newest message, later ones glide.
  useEffect(() => {
    const scroller = scrollRef.current;
    // The welcome screen reads from the top.
    if (!scroller || messages.length === 0) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollTo?.({
      top: scroller.scrollHeight,
      behavior: reduce || !scrolled.current ? "auto" : "smooth",
    });
    scrolled.current = true;
  }, [messages.length, pending]);

  const lastAssistant = messages.findLastIndex(
    (message) => message.role === "assistant",
  );

  return (
    <div className={`lamsa-conversation is-${variant}`}>
      <div className="lamsa-scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          page ? (
            <PageWelcome onPick={send} />
          ) : (
            <PanelWelcome onPick={send} />
          )
        ) : (
          <ol
            className="lamsa-messages"
            role="log"
            aria-live="polite"
            aria-label={t("Conversation with {ASSISTANT_NAME}", {
              ASSISTANT_NAME,
            })}
          >
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                last={index === lastAssistant && !pending}
                onPick={send}
                onNavigate={onNavigate}
              />
            ))}
            {pending && (
              <li className="lamsa-message is-assistant is-typing">
                <LamsaOrb size="sm" animated className="lamsa-avatar" />
                <div className="lamsa-message-body">
                  <span className="lamsa-message-name" aria-hidden="true">
                    {ASSISTANT_NAME}
                  </span>
                  <p className="lamsa-bubble">
                    <span className="sr-only">
                      {t("{ASSISTANT_NAME} is writing", { ASSISTANT_NAME })}
                    </span>
                    <span className="lamsa-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </p>
                </div>
              </li>
            )}
          </ol>
        )}
      </div>
      <div className="lamsa-composer-dock">
        <Composer
          onSend={send}
          pending={pending}
          autoFocus={autoFocus}
          showHint={page}
        />
        <p className="lamsa-disclaimer">
          {t(
            "{ASSISTANT_NAME} answers from Salonhub data. Check details on the salon page.",
            { ASSISTANT_NAME },
          )}
        </p>
      </div>
    </div>
  );
}
