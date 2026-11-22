import { useEffect, useRef } from "react";
import {
  Link,
  useInRouterContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, House, LogIn, RotateCw } from "lucide-react";
import { ERROR_KINDS, ERROR_SHORTCUTS } from "../errors/errorKinds.js";
import t from "../i18n/t.js";

/**
 * The one full-page error view of SalonHub: missing pages, unavailable salons
 * and profiles, missing rights, ended sessions, server and network errors, and
 * page crashes. Pass `kind` (see errorKinds.js); `title` and `message` override
 * the kind's text, and `onRetry` replaces a page reload for "Try again".
 *
 * It also works outside the router (the top-level crash boundary): links then
 * become plain anchors.
 */
export default function ErrorPage(props) {
  return useInRouterContext() ? (
    <RoutedErrorPage {...props} />
  ) : (
    <ErrorView {...props} navigation={plainNavigation} />
  );
}

function RoutedErrorPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = {
    Anchor: Link,
    from: location.pathname + location.search,
    back: () => (window.history.state?.idx > 0 ? navigate(-1) : navigate("/")),
  };
  return <ErrorView {...props} navigation={navigation} />;
}

const plainNavigation = {
  // Outside the router: a plain link (router-only props are dropped).
  Anchor: ({ to, className, children }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  from: typeof window === "undefined" ? "/" : window.location.pathname,
  back: () =>
    window.history.length > 1
      ? window.history.back()
      : window.location.assign("/"),
};

const ACTION_ICONS = {
  home: House,
  back: ArrowLeft,
  login: LogIn,
  retry: RotateCw,
};

function ErrorView({
  kind = "notFound",
  title,
  message,
  onRetry,
  navigation,
  fullScreen = false,
}) {
  const config = ERROR_KINDS[kind] ?? ERROR_KINDS.notFound;
  const KindIcon = config.icon;
  const headingRef = useRef(null);

  // Move focus to the heading so screen readers announce what happened.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [kind]);

  const renderAction = (action, variant) => {
    if (!action) return null;
    const Icon = ACTION_ICONS[action.to];
    const className = `btn ${variant} ep-action`;
    const content = (
      <>
        {Icon && <Icon size={18} aria-hidden="true" />}
        <span>{t(action.label)}</span>
      </>
    );

    if (action.to === "back")
      return (
        <button type="button" className={className} onClick={navigation.back}>
          {content}
        </button>
      );
    if (action.to === "retry")
      return (
        <button
          type="button"
          className={className}
          onClick={onRetry ?? (() => window.location.reload())}
        >
          {content}
        </button>
      );

    const { Anchor } = navigation;
    const to =
      action.to === "home" ? "/" : action.to === "login" ? "/login" : action.to;
    return (
      <Anchor
        className={className}
        to={to}
        state={action.to === "login" ? { from: navigation.from } : undefined}
      >
        {content}
      </Anchor>
    );
  };

  const Wrapper = fullScreen ? "main" : "section";
  return (
    <Wrapper
      className={`ep ${fullScreen ? "ep--full" : ""} ep--${kind}`}
      role={kind === "crash" || kind === "serverError" ? "alert" : undefined}
      aria-labelledby="ep-title"
    >
      <div className="ep-glow" aria-hidden="true" />
      <div className="ep-inner">
        <ErrorCode code={t(config.code)} />

        <SnippedThread />

        <p className="ep-eyebrow">
          <span className="ep-eyebrow-icon" aria-hidden="true">
            <KindIcon size={16} />
          </span>
          {t(config.eyebrow)}
        </p>
        <h1 id="ep-title" className="ep-title" tabIndex={-1} ref={headingRef}>
          {title ?? t(config.title)}
        </h1>
        <p className="ep-message">{message ?? t(config.message)}</p>

        <div className="ep-actions">
          {renderAction(config.primary, "btn-primary")}
          {renderAction(config.secondary, "btn-secondary")}
        </div>

        {config.showShortcuts && (
          <nav className="ep-shortcuts" aria-label={t("Popular places")}>
            <span className="ep-shortcuts-label">{t("Or jump to")}</span>
            <ul>
              {ERROR_SHORTCUTS.map((item) => (
                <li key={item.to}>
                  <navigation.Anchor className="ep-shortcut" to={item.to}>
                    {t(item.label)}
                  </navigation.Anchor>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </Wrapper>
  );
}

/** Digits rise one by one; a word stays whole so Arabic letters keep joining. */
function ErrorCode({ code }) {
  const parts = /^\d+$/.test(code) ? [...code] : [code];
  return (
    <p className="ep-code" aria-hidden="true">
      {parts.map((part, index) => (
        <span key={index} style={{ "--ep-i": index }}>
          {part}
        </span>
      ))}
    </p>
  );
}

/**
 * Signature animation: scissors travel along a stitched thread, snip it, and
 * the loose end falls away. Pure SVG + CSS (transform and opacity only).
 */
function SnippedThread() {
  return (
    <svg
      className="ep-scene"
      viewBox="0 0 520 120"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ep-thread" d="M16 70 C 120 58, 220 82, 322 70" />
      <g className="ep-thread-loose">
        <path className="ep-thread" d="M330 70 C 390 62, 450 80, 504 70" />
        <circle className="ep-thread-needle" cx="504" cy="70" r="5" />
      </g>
      <g className="ep-scissors">
        <g className="ep-blade ep-blade--top">
          <circle cx="6" cy="-11" r="8" />
          <path d="M12 -6 L22 0" />
          <path
            className="ep-blade-edge"
            d="M20 -1.5 L60 -4 Q63 -1 60 1 L20 1.5 Z"
          />
        </g>
        <g className="ep-blade ep-blade--bottom">
          <circle cx="6" cy="11" r="8" />
          <path d="M12 6 L22 0" />
          <path
            className="ep-blade-edge"
            d="M20 1.5 L60 4 Q63 1 60 -1 L20 -1.5 Z"
          />
        </g>
        <circle className="ep-pivot" cx="21" cy="0" r="2.4" />
      </g>
    </svg>
  );
}
