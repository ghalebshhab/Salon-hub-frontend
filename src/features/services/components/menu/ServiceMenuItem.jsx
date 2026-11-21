import { Check, Clock3, Plus } from "lucide-react";
import { serviceDuration, servicePrice } from "../../model/serviceMenu.js";

/**
 * One line of the salon's menu: name, short description, time and price.
 * With `onToggle`, the customer adds it to (or removes it from) the visit.
 */
export default function ServiceMenuItem({
  service,
  selected = false,
  disabled = false,
  onToggle,
}) {
  const name = service.name || "Service";
  return (
    <li className={`menu-item ${selected ? "is-selected" : ""}`}>
      <div className="menu-item-main">
        <div className="menu-item-line">
          <h3>{name}</h3>
          <span className="menu-item-leader" aria-hidden="true" />
          <strong className="menu-item-price">{servicePrice(service)}</strong>
        </div>
        {service.description?.trim() && (
          <p className="menu-item-description">{service.description}</p>
        )}
        <span className="menu-item-duration">
          <Clock3 size={13} aria-hidden="true" />
          {serviceDuration(service)}
        </span>
      </div>
      {onToggle && (
        <button
          className="menu-item-toggle"
          type="button"
          aria-pressed={selected}
          disabled={disabled && !selected}
          onClick={() => onToggle(service)}
        >
          {selected ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Plus size={16} aria-hidden="true" />
          )}
          <span>{selected ? "Added" : "Add"}</span>
          <span className="sr-only"> {name}</span>
        </button>
      )}
    </li>
  );
}
