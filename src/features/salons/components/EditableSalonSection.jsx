import { Check, Pencil, X } from "lucide-react";

export default function EditableSalonSection({
  eyebrow,
  title,
  description,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  children,
  editor,
  className = "",
}) {
  const submit = async (event) => {
    event.preventDefault();
    await onSave();
  };

  return (
    <section
      className={`owner-edit-section ${editing ? "is-editing" : ""} ${className}`}
    >
      <header className="owner-edit-section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {!editing && (
          <button
            className="owner-edit-trigger"
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
          >
            <Pencil size={16} /> Edit
          </button>
        )}
      </header>
      {editing ? (
        <form className="owner-inline-editor" onSubmit={submit}>
          {editor}
          <div className="owner-inline-actions">
            <button className="btn btn-primary" disabled={saving}>
              <Check size={17} /> {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={saving}
              onClick={onCancel}
            >
              <X size={17} /> Cancel
            </button>
          </div>
        </form>
      ) : (
        children
      )}
    </section>
  );
}
