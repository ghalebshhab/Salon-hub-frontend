import {
  Bell,
  ChevronRight,
  IdCard,
  Languages,
  LogOut,
  MapPin,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useId } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../auth/hooks/useLogout.js";
import useAuth from "../../../shared/auth/useAuth.js";
import { LANGUAGES } from "../../../shared/i18n/language.js";
import useI18n from "../../../shared/i18n/useI18n.js";
import useTheme from "../../../shared/theme/useTheme.js";
import usePermissionState from "../hooks/usePermissionState.js";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

const SECTIONS = [
  { id: "language", label: t("Language"), icon: Languages },
  { id: "appearance", label: t("Appearance"), icon: Palette },
  { id: "alerts", label: t("Alerts"), icon: Bell },
  { id: "location", label: t("Location"), icon: MapPin },
  { id: "account", label: t("Account"), icon: UserRound, signedIn: true },
];

const PERMISSION_TEXT = {
  granted: { label: t("Allowed"), tone: "ok" },
  denied: { label: t("Blocked"), tone: "off" },
  prompt: { label: t("Not asked yet"), tone: "idle" },
  unsupported: { label: t("Not available"), tone: "off" },
};

/** A group of settings: a title, a short line and its rows. */
function SettingsSection({ id, icon: Icon, title, intro, children }) {
  return (
    <section className="st-section" id={id} aria-labelledby={`${id}-title`}>
      <header className="st-section-head">
        <span className="st-section-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <div>
          <h2 id={`${id}-title`}>{t(title)}</h2>
          {intro && <p>{intro}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

/** One choice card in a radio group (language, theme). */
function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  hint,
  lang,
  dir,
  children,
}) {
  return (
    <label className={`st-choice ${checked ? "is-checked" : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      {children}
      <span className="st-choice-text">
        <strong lang={lang} dir={dir}>
          {t(title)}
        </strong>
        {hint && (
          <small lang={lang} dir={dir}>
            {t(hint)}
          </small>
        )}
      </span>
      <span className="st-choice-check" aria-hidden="true" />
    </label>
  );
}

function PermissionRow({ icon: Icon, title, text, state, action }) {
  const { t } = useI18n();
  const status = PERMISSION_TEXT[state] ?? PERMISSION_TEXT.unsupported;
  return (
    <div className="st-row">
      <span className="st-row-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className="st-row-text">
        <strong>{t(title)}</strong>
        <p>{t(text)}</p>
      </div>
      <div className="st-row-control">
        <span className={`st-status is-${status.tone}`}>{t(status.label)}</span>
        {action}
      </div>
    </div>
  );
}

/**
 * Settings: language, appearance, browser alerts, location and account.
 * Language and theme are saved in this browser; nothing here is sent to
 * the server.
 */
export default function Settings() {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const { loggedIn } = useAuth();
  const logout = useLogout();
  const [alerts, refreshAlerts] = usePermissionState("notifications");
  const [location] = usePermissionState("geolocation");
  const languageGroup = useId();
  const themeGroup = useId();

  const askForAlerts = async () => {
    try {
      await Notification.requestPermission();
    } finally {
      refreshAlerts();
    }
  };

  const sections = SECTIONS.filter((section) => !section.signedIn || loggedIn);

  return (
    <div className="st-page">
      <header className="st-hero">
        <p className="st-eyebrow">{t(PAGE_HEADS.settings.eyebrow)}</p>
        <h1>{t(PAGE_HEADS.settings.title)}</h1>
        <p>{t(PAGE_HEADS.settings.text)}</p>
      </header>

      <div className="st-layout">
        <nav className="st-nav" aria-label={t("Settings sections")}>
          {sections.map(({ id, label, icon: Icon }) => (
            <a key={id} href={`#${id}`}>
              <Icon size={16} aria-hidden="true" />
              {t(label)}
            </a>
          ))}
        </nav>

        <div className="st-content">
          <SettingsSection
            id="language"
            icon={Languages}
            title={t("Language")}
            intro={t(
              "The menus and pages change at once. Some pages are still in English while we translate them.",
            )}
          >
            <div
              className="st-choices"
              role="radiogroup"
              aria-label={t("Language")}
            >
              {LANGUAGES.map((option) => (
                <ChoiceCard
                  key={option.code}
                  name={languageGroup}
                  value={option.code}
                  checked={language === option.code}
                  onChange={setLanguage}
                  title={option.nativeLabel}
                  hint={option.sample}
                  lang={option.code}
                  dir={option.dir}
                >
                  <span
                    className="st-choice-badge"
                    aria-hidden="true"
                    lang={option.code}
                  >
                    {option.code === "ar" ? "ع" : t("Aa")}
                  </span>
                </ChoiceCard>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection
            id="appearance"
            icon={Palette}
            title={t("Appearance")}
            intro={t(
              "Pick light or dark. You can also switch it from the moon and sun button in the header.",
            )}
          >
            <div
              className="st-choices"
              role="radiogroup"
              aria-label={t("Theme")}
            >
              {[
                {
                  value: "light",
                  title: t("Light"),
                  hint: t("Bright and clear"),
                  Icon: Sun,
                },
                {
                  value: "dark",
                  title: t("Dark"),
                  hint: t("Easy on the eyes at night"),
                  Icon: Moon,
                },
              ].map(({ value, title, hint, Icon }) => (
                <ChoiceCard
                  key={value}
                  name={themeGroup}
                  value={value}
                  checked={theme === value}
                  onChange={setTheme}
                  title={t(title)}
                  hint={hint}
                >
                  <span
                    className={`st-theme-preview is-${value}`}
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <Icon size={14} />
                  </span>
                </ChoiceCard>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection
            id="alerts"
            icon={Bell}
            title={t("Alerts")}
            intro={t(
              "Your notifications always wait for you in the bell. Browser alerts also pop up while SalonHub is open.",
            )}
          >
            <PermissionRow
              icon={Bell}
              title={t("Browser alerts")}
              text={t("For example: “Time to leave for your appointment”.")}
              state={alerts}
              action={
                alerts === "prompt" && (
                  <button
                    className="btn btn-secondary btn-small"
                    type="button"
                    onClick={askForAlerts}
                  >
                    {t("Allow")}
                  </button>
                )
              }
            />
            {alerts === "denied" && (
              <p className="st-help">
                {t(
                  "Alerts are blocked. Allow them from the lock icon next to the address bar.",
                )}
              </p>
            )}
            {loggedIn && (
              <Link className="st-row st-row-link" to="/notifications">
                <span className="st-row-icon" aria-hidden="true">
                  <Bell size={18} />
                </span>
                <span className="st-row-text">
                  <strong>{t("All notifications")}</strong>
                  <p>{t("Bookings, reminders and messages in one list.")}</p>
                </span>
                <ChevronRight
                  className="st-row-go"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            )}
          </SettingsSection>

          <SettingsSection
            id="location"
            icon={MapPin}
            title={t("Location")}
            intro={t(
              "We ask for your location only when you tap “Tell me when to leave” or “I'm on my way”.",
            )}
          >
            <PermissionRow
              icon={MapPin}
              title={t("Location on this device")}
              text={t(
                "Used for the drive time to the salon. Only you and, while you are on the way, the salon see it.",
              )}
              state={location}
            />
            {location === "denied" && (
              <p className="st-help">
                {t(
                  "Location is blocked. Allow it from the lock icon next to the address bar.",
                )}
              </p>
            )}
          </SettingsSection>

          {loggedIn && (
            <SettingsSection id="account" icon={UserRound} title={t("Account")}>
              {[
                {
                  to: "/profile/career",
                  icon: IdCard,
                  title: t("Career profile"),
                  text: t("Your public profile, skills and work photos."),
                },
                {
                  to: "/account/security",
                  icon: ShieldCheck,
                  title: t("Account security"),
                  text: t("Change your password."),
                },
              ].map(({ to, icon: Icon, title, text }) => (
                <Link key={to} className="st-row st-row-link" to={to}>
                  <span className="st-row-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="st-row-text">
                    <strong>{t(title)}</strong>
                    <p>{t(text)}</p>
                  </span>
                  <ChevronRight
                    className="st-row-go"
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
              ))}
              <button
                className="st-row st-row-link is-danger"
                type="button"
                onClick={() => void logout()}
              >
                <span className="st-row-icon" aria-hidden="true">
                  <LogOut size={18} />
                </span>
                <span className="st-row-text">
                  <strong>{t("Log out")}</strong>
                  <p>{t("Sign out on this device.")}</p>
                </span>
              </button>
            </SettingsSection>
          )}
        </div>
      </div>
    </div>
  );
}
