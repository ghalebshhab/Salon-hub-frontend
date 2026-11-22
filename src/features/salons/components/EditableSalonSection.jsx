import { Check, Pencil, X } from "lucide-react";
import t from "../../../shared/i18n/t.js";

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
          <span className="eyebrow">{t(eyebrow)}</span>
          <h2>{t(title)}</h2>
          {description && <p>{t(description)}</p>}
        </div>
        {!editing && (
          <button
            className="owner-edit-trigger"
            type="button"
            onClick={onEdit}
            aria-label={t("Edit {title}", { title })}
          >
            <Pencil size={16} /> {t("Edit")}
          </button>
        )}
      </header>
      {editing ? (
        <form className="owner-inline-editor" onSubmit={submit}>
          {editor}
          <div className="owner-inline-actions">
            <button className="btn btn-primary" disabled={saving}>
              <Check size={17} /> {saving ? t("Saving…") : t("Save changes")}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={saving}
              onClick={onCancel}
            >
              <X size={17} /> {t("Cancel")}
            </button>
          </div>
        </form>
      ) : (
        children
      )}
    </section>
  );
}
