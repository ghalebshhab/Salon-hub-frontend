import { useMemo, useState } from "react";
import { RefreshCw, Scissors, Search } from "lucide-react";
import useSalonServicesList from "../hooks/useSalonServicesList.js";
import ServiceMenuItem from "./menu/ServiceMenuItem.jsx";
import ServiceSelectionBar from "./menu/ServiceSelectionBar.jsx";
import {
  MAX_SERVICES_PER_VISIT,
  MENU_SORTS,
  MENU_TOOLS_MIN,
  menuSummary,
  visibleServices,
} from "../model/serviceMenu.js";

function MenuSkeleton() {
  return (
    <ul className="menu-list" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <li className="menu-item is-skeleton" key={item}>
          <span className="menu-skeleton-line is-wide" />
          <span className="menu-skeleton-line" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The salon's services as a menu. Customers add services to one visit and
 * book them together. `booking` is null where nobody books (the owner).
 */
function SalonServicesList({ salonId, booking = null }) {
  const { services, loading, error, refetch } = useSalonServicesList({
    salonId,
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("salon");
  const [selectedIds, setSelectedIds] = useState([]);

  const summary = useMemo(() => menuSummary(services), [services]);
  const visible = useMemo(
    () => visibleServices(services, { query, sort }),
    [services, query, sort],
  );
  const selected = services.filter((service) =>
    selectedIds.includes(service.id),
  );
  const full = selectedIds.length >= MAX_SERVICES_PER_VISIT;

  const toggle = (service) =>
    setSelectedIds((ids) =>
      ids.includes(service.id)
        ? ids.filter((id) => id !== service.id)
        : [...ids, service.id],
    );

  if (loading) return <MenuSkeleton />;

  if (error && !services.length) {
    return (
      <div className="menu-empty" role="alert">
        <h3>The services could not be loaded</h3>
        <p>Check your connection and try again.</p>
        <button className="btn btn-secondary" type="button" onClick={refetch}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="menu-empty">
        <span className="menu-empty-icon" aria-hidden="true">
          <Scissors size={24} />
        </span>
        <h3>The menu is coming soon</h3>
        <p>This salon has not added its services yet. Call the salon to ask.</p>
      </div>
    );
  }

  const showTools = services.length >= MENU_TOOLS_MIN;

  return (
    <div className="menu">
      <div className="menu-top">
        <p className="menu-summary">
          <strong>{summary.count}</strong>
          {summary.count === 1 ? " service" : " services"}
          <span aria-hidden="true"> · </span>
          from <strong>{summary.fromPrice}</strong>
          {summary.shortest && (
            <>
              <span aria-hidden="true"> · </span>
              {summary.shortest === summary.longest
                ? summary.shortest
                : `${summary.shortest} to ${summary.longest}`}
            </>
          )}
        </p>
        {booking && (
          <p className="menu-hint">
            Add one or more services, then choose a time.
          </p>
        )}
      </div>

      {showTools && (
        <div className="menu-tools">
          <label className="menu-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search services</span>
            <input
              type="search"
              value={query}
              placeholder="Search services"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="menu-sort">
            <span className="sr-only">Sort services</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {MENU_SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {visible.length ? (
        <ul className="menu-list">
          {visible.map((service, index) => (
            <ServiceMenuItem
              key={service.id}
              index={index}
              service={service}
              selected={selectedIds.includes(service.id)}
              disabled={full}
              onToggle={booking ? toggle : null}
            />
          ))}
        </ul>
      ) : (
        <div className="menu-empty is-compact">
          <p>No service matches “{query.trim()}”.</p>
          <button
            className="btn btn-secondary btn-small"
            type="button"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </div>
      )}

      {full && (
        <p className="menu-hint" role="status">
          One visit can have up to {MAX_SERVICES_PER_VISIT} services.
        </p>
      )}

      {booking && (
        <ServiceSelectionBar
          selected={selected}
          booking={booking}
          onClear={() => setSelectedIds([])}
        />
      )}
    </div>
  );
}

export default SalonServicesList;
