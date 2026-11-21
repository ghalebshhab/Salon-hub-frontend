import { useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * A small "More" menu for actions most visitors do not need (report,
 * join the team). Escape and a click outside close it.
 * Each action: { key, label, icon: Component, onClick? | to?, state?, disabled? }.
 */
export default function SalonMoreMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    rootRef.current?.querySelector(".sh-menu-item")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!actions.length) return null;

  const close = () => setOpen(false);

  return (
    <div className="sh-more" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="sh-icon-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="More actions"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal size={20} aria-hidden="true" />
      </button>
      {open && (
        <ul className="sh-menu" id={menuId}>
          {actions.map(
            ({ key, label, icon: Icon, to, state, onClick, disabled }) => (
              <li key={key}>
                {to ? (
                  <Link
                    className="sh-menu-item"
                    to={to}
                    state={state}
                    onClick={close}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="sh-menu-item"
                    disabled={disabled}
                    onClick={() => {
                      close();
                      onClick();
                    }}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </button>
                )}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
