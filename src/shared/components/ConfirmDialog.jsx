import { AlertTriangle, X } from "lucide-react";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <button
          className="confirm-dialog-close"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          <X size={18} />
        </button>

        <div className={danger ? "confirm-icon danger" : "confirm-icon"}>
          <AlertTriangle size={30} />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-dialog-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className={danger ? "btn btn-danger" : "btn btn-primary"}
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
