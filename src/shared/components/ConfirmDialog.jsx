import { CircleHelp, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import t from "../i18n/t.js";

/**
 * The one confirmation dialog of the app. Use it directly with `open`, or
 * call `confirmAction()` from a hook (see shared/confirm/confirmStore.js).
 * With `input`, it also asks for a text (for example a rejection reason).
 */
function ConfirmDialog({ open, ...props }) {
  // The panel mounts fresh on each open, so its text field starts empty.
  return open ? <ConfirmDialogPanel {...props} /> : null;
}

function ConfirmDialogPanel({
  title = t("Are you sure?"),
  message = t("This action cannot be undone."),
  confirmText = t("Confirm"),
  cancelText = t("Cancel"),
  danger = false,
  loading = false,
  input = null,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const messageId = useId();
  const inputId = useId();
  const cancelRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState(input?.defaultValue || "");
  const hasInput = Boolean(input);
  // A warning sign only for risky actions; a question mark otherwise.
  const Icon = danger ? TriangleAlert : CircleHelp;

  useEffect(() => {
    // Focus the safe choice first; for a text dialog, focus the field.
    // Focus stays in the dialog, so its onKeyDown handles Escape.
    (hasInput ? inputRef.current : cancelRef.current)?.focus();
  }, [hasInput]);

  const missingText = Boolean(input?.required) && !value.trim();

  const submit = (event) => {
    event.preventDefault();
    if (loading || missingText) return;
    onConfirm?.(input ? value.trim() : undefined);
  };

  return (
    <div
      className="confirm-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel?.();
      }}
    >
      <form
        className={danger ? "confirm-dialog is-danger" : "confirm-dialog"}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onSubmit={submit}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !loading) {
            event.stopPropagation();
            onCancel?.();
          }
        }}
      >
        <button
          className="confirm-dialog-close"
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label={t("Close")}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="confirm-dialog-body">
          <span className="confirm-icon" aria-hidden="true">
            <Icon size={22} strokeWidth={2} />
          </span>

          <div className="confirm-dialog-copy">
            <h2 id={titleId}>{t(title)}</h2>
            <p id={messageId}>{message}</p>
          </div>

          {input && (
            <div className="confirm-dialog-field">
              <label htmlFor={inputId}>{t(input.label)}</label>
              <textarea
                id={inputId}
                ref={inputRef}
                rows={3}
                maxLength={input.maxLength || 1000}
                placeholder={t(input.placeholder)}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="confirm-dialog-actions">
          <button
            ref={cancelRef}
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className="btn confirm-dialog-confirm"
            type="submit"
            disabled={loading || missingText}
            aria-busy={loading || undefined}
          >
            {loading && (
              <LoaderCircle
                size={16}
                className="confirm-dialog-spinner"
                aria-hidden="true"
              />
            )}
            {loading ? t("Please wait…") : confirmText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfirmDialog;
