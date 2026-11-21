import { Check, Clock3, Plus } from "lucide-react";
import { serviceDuration, servicePrice } from "../../model/serviceMenu.js";

/**
 * One tile of the salon's menu: number, name, short description, time and
 * price. With `onToggle`, a click anywhere on the tile adds the service to
 * the visit (or removes it); the round button is the real control.
 */
export default function ServiceMenuItem({
  service,
  index = 0,
  selected = false,
  disabled = false,
  onToggle,
}) {
  const name = service.name || "Service";
  const blocked = disabled && !selected;
  const className = [
    "menu-item",
    selected ? "is-selected" : "",
    onToggle ? "is-pickable" : "",
    blocked ? "is-blocked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={className}>
      <div className="menu-item-head">
        <span className="menu-item-no" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        {onToggle && (
          <button
            className="menu-item-toggle"
            type="button"
            aria-pressed={selected}
            disabled={blocked}
            onClick={() => onToggle(service)}
          >
            {selected ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Plus size={18} aria-hidden="true" />
            )}
            <span className="sr-only">
              {selected ? `Remove ${name}` : `Add ${name}`}
            </span>
          </button>
        )}
      </div>

      <h3>{name}</h3>
      {service.description?.trim() && (
        <p className="menu-item-description">{service.description}</p>
      )}

      <div className="menu-item-foot">
        <span className="menu-item-duration">
          <Clock3 size={13} aria-hidden="true" />
          {serviceDuration(service)}
        </span>
        <strong className="menu-item-price">{servicePrice(service)}</strong>
      </div>
    </li>
  );
}
