import { ChevronDown, Plus } from "lucide-react";
import { useId, useState } from "react";
import { NavLink } from "react-router-dom";

// Compact "New" disclosure for owner create actions in a sidebar section.
export default function SidebarCreateMenu({ actions, onNavigate }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className={`sidebar-create ${open ? "is-open" : ""}`.trim()}>
      <button
        className="sidebar-create-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
      >
        <Plus aria-hidden="true" />
        <span>New</span>
        <ChevronDown className="sidebar-create-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="sidebar-create-list" id={listId}>
          {actions.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="sidebar-create-item"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              <Icon aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
