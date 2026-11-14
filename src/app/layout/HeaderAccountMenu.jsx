import { LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * Avatar button with a dropdown of account destinations.
 * Closes on outside click, Escape (returning focus to the avatar),
 * and route changes; opening moves focus to the first item.
 */
export default function HeaderAccountMenu({
  initials,
  name,
  roleLabel,
  links,
  onLogout,
}) {
  const location = useLocation();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === location.pathname;
  const setOpen = (next) =>
    setOpenPath((current) => {
      const value =
        typeof next === "function" ? next(current === location.pathname) : next;
      return value ? location.pathname : null;
    });
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector("a, button")?.focus();

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpenPath(null);
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpenPath(null);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="header-profile-wrap" ref={wrapRef}>
      <button
        ref={buttonRef}
        className="header-avatar-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open account menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <span aria-hidden="true">{initials}</span>
      </button>
      {open && (
        <div className="header-profile-menu" id={menuId} ref={menuRef}>
          {name && (
            <div className="header-profile-identity">
              <span aria-hidden="true">{initials}</span>
              <div>
                <strong>{name}</strong>
                {roleLabel && <small>{roleLabel}</small>}
              </div>
            </div>
          )}
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {Icon && <Icon aria-hidden="true" />}
              {label}
            </NavLink>
          ))}
          <button
            className="header-profile-logout"
            type="button"
            onClick={() => void onLogout(() => setOpen(false))}
          >
            <LogOut aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
