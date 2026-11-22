import { useLocation } from "react-router-dom";
import AuthStory from "./AuthStory.jsx";
import { AUTH_COPY } from "../model/authCopy.js";
import {
  Bone,
  SkeletonPage,
  TextBone,
} from "../../../shared/components/skeleton/Bone.jsx";
import t from "../../../shared/i18n/t.js";

/**
 * The form shape of each sign-in page: rows of fields (1 = full width,
 * 2 = two side by side, "code" = the code field with its hint) and a second
 * button under the main one.
 */
const FORMS = {
  login: { rows: [1, 1] },
  register: { rows: [2, 1, 2, 1] },
  verifyEmail: { rows: [1, "code"], secondary: true },
  forgotPassword: { rows: [1] },
  verifyResetCode: { rows: [1, "code"] },
  resetPassword: { rows: [1, 1] },
  accountSecurity: { rows: [1, 1, 1] },
};

/**
 * One field: the same rounded box as the real input. The six-digit code
 * input is a little taller (larger digits) and has its hint line under it.
 */
function FieldBone({ hint }) {
  return (
    <div className="auth-field">
      <Bone h={hint ? 56.8 : 56} r="20px" />
      {hint && (
        <p className="auth-hint">
          <TextBone>{t(hint)}</TextBone>
        </p>
      )}
    </div>
  );
}

/** Fixed text of the page, as bars that wrap like the real text. */
function Copy({ items }) {
  return <TextBone>{items.map((item) => t(item)).join(" ")}</TextBone>;
}

/**
 * Same layout as AuthShell: the real brand panel stays (it has no data). The
 * card shows the page's own fixed text as shimmer bars, so each line has the
 * real size and wraps the same way, and bones in the place of the controls.
 */
export default function AuthPageSkeleton({ form = "login" }) {
  const shape = FORMS[form] ?? FORMS.login;
  const copy = AUTH_COPY[form] ?? AUTH_COPY.login;
  // The reset page shows a notice when it was opened without a verified code
  // (the same check the page makes on the navigation state).
  const { state } = useLocation();
  const showStatus = form === "resetPassword" && !state?.resetToken;
  return (
    <SkeletonPage className="auth-experience">
      <AuthStory />
      <section className="auth-panel">
        <div className="auth-card auth-card-modern skeleton-frame">
          <div className="auth-heading">
            <p className="auth-kicker">
              <TextBone>{t(copy.eyebrow)}</TextBone>
            </p>
            <h2>
              <TextBone>{t(copy.title)}</TextBone>
            </h2>
            <p className="auth-intro">
              <TextBone>{t(copy.intro)}</TextBone>
            </p>
          </div>
          {showStatus && (
            <div className="auth-flow-status">
              {copy.status.map((line) => (
                <span key={line}>
                  <TextBone>{t(line)}</TextBone>
                </span>
              ))}
            </div>
          )}
          <div className="auth-form">
            {shape.rows.map((columns, index) =>
              columns === 2 ? (
                <div className="auth-form-row" key={index}>
                  <FieldBone />
                  <FieldBone />
                </div>
              ) : (
                <FieldBone
                  key={index}
                  hint={columns === "code" ? copy.codeHint : undefined}
                />
              ),
            )}
            {copy.inline && (
              <div className="auth-inline">
                <TextBone>{t(copy.inline[0])}</TextBone>
                <TextBone>{t(copy.inline[1])}</TextBone>
              </div>
            )}
            {copy.hint && (
              <p className="auth-hint">
                <Copy items={copy.hint} />
              </p>
            )}
            <Bone h={52} r="14px" />
            {shape.secondary && <Bone h={44} r="xs" />}
          </div>
          {copy.note && (
            <div className="auth-note">
              <Copy items={copy.note} />
            </div>
          )}
          {copy.footer && (
            <p className="auth-footer">
              <Copy items={copy.footer} />
            </p>
          )}
        </div>
      </section>
    </SkeletonPage>
  );
}
