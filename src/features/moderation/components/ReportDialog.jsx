import { Flag, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import useReport from "../hooks/useReport.js";

const reasons = [
  ["SPAM", "Spam or misleading"],
  ["HARASSMENT", "Harassment or bullying"],
  ["INAPPROPRIATE_CONTENT", "Inappropriate content"],
  ["IMPERSONATION", "Impersonation"],
  ["SCAM", "Scam or unsafe activity"],
  ["OTHER", "Something else"],
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
            <p>Safety report</p>
            <h2>Report {targetLabel}</h2>
          </div>
          <button
            type="button"
            aria-label="Close report dialog"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </header>
        <p className="report-dialog-intro">
          Tell our moderation team what happened. The reported account will not
          see who submitted the report.
        </p>
        <fieldset>
          <legend>What is the problem?</legend>
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
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <label className="report-details-label" htmlFor="report-details">
          Additional details <small>Optional</small>
        </label>
        <textarea
          id="report-details"
          maxLength={1000}
          rows={4}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Add context that will help the moderation team…"
        />
        <footer>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            <Flag size={16} /> {submitting ? "Submitting…" : "Submit report"}
          </button>
        </footer>
      </form>
    </div>
  );
}
