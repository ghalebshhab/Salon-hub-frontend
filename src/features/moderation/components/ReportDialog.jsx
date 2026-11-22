import { Flag, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import useReport from "../hooks/useReport.js";
import t from "../../../shared/i18n/t.js";

const reasons = [
  ["SPAM", t("Spam or misleading")],
  ["HARASSMENT", t("Harassment or bullying")],
  ["INAPPROPRIATE_CONTENT", t("Inappropriate content")],
  ["IMPERSONATION", t("Impersonation")],
  ["SCAM", t("Scam or unsafe activity")],
  ["OTHER", t("Something else")],
];

export default function ReportDialog({
  targetType,
  targetId,
  targetLabel,
  onClose,
}) {
  const [reason, setReason] = useState("SPAM");
  const [details, setDetails] = useState("");
  const { submitting, submitReport } = useReport();

  const submit = async (event) => {
    event.preventDefault();
    if (
      await submitReport({
        targetType,
        targetId,
        reason,
        details: details.trim() || null,
      })
    )
      onClose();
  };

  return (
    <div
      className="report-dialog-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <form
        className="report-dialog"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <span>
            <ShieldAlert size={19} />
          </span>
          <div>
            <p>{t("Safety report")}</p>
            <h2>{t("Report {targetLabel}", { targetLabel })}</h2>
          </div>
          <button
            type="button"
            aria-label={t("Close report dialog")}
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </header>
        <p className="report-dialog-intro">
          {t(
            "Tell our moderation team what happened. The reported account will not see who submitted the report.",
          )}
        </p>
        <fieldset>
          <legend>{t("What is the problem?")}</legend>
          {reasons.map(([value, label]) => (
            <label
              className={reason === value ? "is-selected" : ""}
              key={value}
            >
              <input
                type="radio"
                name="report-reason"
                value={value}
                checked={reason === value}
                onChange={() => setReason(value)}
              />
              <span>{t(label)}</span>
            </label>
          ))}
        </fieldset>
        <label className="report-details-label" htmlFor="report-details">
          {t("Additional details")} <small>{t("Optional")}</small>
        </label>
        <textarea
          id="report-details"
          maxLength={1000}
          rows={4}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder={t("Add context that will help the moderation team…")}
        />
        <footer>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            {t("Cancel")}
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            <Flag size={16} />{" "}
            {submitting ? t("Submitting…") : t("Submit report")}
          </button>
        </footer>
      </form>
    </div>
  );
}
