import {
  ArrowRight,
  CornerDownLeft,
  Hash,
  LoaderCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../shared/auth/useAuth.js";
import { collectPageSections, getSearchPages } from "./searchCatalog.js";
import { matchText, searchItems } from "../../shared/search/searchModel.js";
import HighlightedText from "../../shared/components/HighlightedText.jsx";
import { OPEN_SEARCH_EVENT } from "./searchEvents.js";
import usePeopleSearch from "./usePeopleSearch.js";

function isTypingTarget(element) {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName))
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openSearch = () => setOpen(true);
    const onKeyDown = (event) => {
      const shortcut =
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey);
      const slash = event.key === "/" && !isTypingTarget(event.target);
      if (shortcut || slash) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, openSearch);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, openSearch);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return open ? <PaletteDialog onClose={() => setOpen(false)} /> : null;
}

function PaletteDialog({ onClose }) {
  const { loggedIn, isOwner, role, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocusRef = useRef(null);
  const listId = useId();

  // Snapshot of the page's own sections, taken when the search opens.
  const [sections] = useState(() =>
    collectPageSections(document.getElementById("main-content")),
  );
  const pages = useMemo(
    () =>
      getSearchPages({
        loggedIn,
        isOwner,
        hasSalon: Boolean(user?.ownedSalonId),
        isEmployee: role === "EMPLOYEE",
      }),
    [loggedIn, isOwner, role, user?.ownedSalonId],
  );
  const { people, loading, error } = usePeopleSearch(query, loggedIn);

  const groups = useMemo(() => {
    if (!query.trim()) {
      return [
        {
          label: "On this page",
          results: sections.slice(0, 6).map((item) => ({ item, ranges: [] })),
        },
        {
          label: "Suggested pages",
          results: pages
            .filter((page) => page.to !== pathname)
            .slice(0, 5)
            .map((item) => ({ item, ranges: [] })),
        },
      ].filter((group) => group.results.length);
    }
    const peopleResults = people.slice(0, 6).map((person) => {
      const title = person.displayName || person.userName;
      const match =
        matchText(title, query) ?? matchText(person.userName ?? "", query);
      return {
        item: {
          id: `person:${person.id}`,
          title,
          subtitle: `@${person.userName}`,
          to: `/community/people/${person.id}`,
          person: true,
        },
        ranges: matchText(title, query)?.ranges ?? [],
        score: match?.score ?? 0,
      };
    });
    return [
      { label: "On this page", results: searchItems(sections, query, 6) },
      { label: "Pages", results: searchItems(pages, query, 8) },
      { label: "People", results: peopleResults },
    ].filter((group) => group.results.length);
  }, [query, sections, pages, people, pathname]);

  const flat = groups.flatMap((group) => group.results);
  const safeIndex = Math.min(activeIndex, Math.max(flat.length - 1, 0));
  const optionId = (index) => `${listId}-option-${index}`;

  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    inputRef.current?.focus();
    document.body.classList.add("command-palette-open");
    return () => {
      document.body.classList.remove("command-palette-open");
      returnFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${safeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeIndex]);

  const choose = (result) => {
    if (!result) return;
    const { item } = result;
    onClose();
    if (item.targetId) {
      // Wait a frame so focus restoration doesn't fight the scroll.
      window.requestAnimationFrame(() => {
        const target = document.getElementById(item.targetId);
        if (!target) return;
        target.setAttribute("tabindex", "-1");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.focus({ preventScroll: true });
        target.classList.add("search-target-flash");
        window.setTimeout(
          () => target.classList.remove("search-target-flash"),
          1600,
        );
      });
    } else if (item.to) {
      navigate(item.to);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((safeIndex + 1) % Math.max(flat.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (safeIndex - 1 + Math.max(flat.length, 1)) % Math.max(flat.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(flat[safeIndex]);
    } else if (event.key === "Tab") {
      // Keep focus in the dialog; the input owns all interaction.
      event.preventDefault();
    }
  };

  let index = -1;
  const searchingPeople = loggedIn && query.trim() && loading;

  return (
    <div className="command-palette-layer" onMouseDown={onClose}>
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search SalonHub"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-palette-input">
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              flat.length ? optionId(safeIndex) : undefined
            }
            placeholder={
              loggedIn
                ? "Search pages, sections, and people…"
                : "Search pages and sections…"
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          {searchingPeople && (
            <LoaderCircle
              className="command-palette-spinner"
              aria-hidden="true"
            />
          )}
          <button
            type="button"
            className="command-palette-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="command-palette-results" ref={listRef}>
          <ul id={listId} role="listbox" aria-label="Search results">
            {groups.map((group) => (
              <li key={group.label} role="presentation">
                <div className="command-palette-group" role="presentation">
                  {group.label}
                </div>
                <ul role="group" aria-label={group.label}>
                  {group.results.map((result) => {
                    index += 1;
                    const current = index;
                    const { item } = result;
                    const Icon = item.person
                      ? UserRound
                      : item.targetId
                        ? Hash
                        : (item.icon ?? ArrowRight);
                    return (
                      <li
                        key={item.id}
                        id={optionId(current)}
                        data-index={current}
                        role="option"
                        aria-selected={current === safeIndex}
                        className="command-palette-option"
                        onMouseMove={() => setActiveIndex(current)}
                        onClick={() => choose(result)}
                      >
                        <span
                          className={`command-palette-icon ${item.person ? "is-person" : ""}`.trim()}
                          aria-hidden="true"
                        >
                          {item.person ? (
                            item.title.slice(0, 1).toLocaleUpperCase()
                          ) : (
                            <Icon />
                          )}
                        </span>
                        <span className="command-palette-copy">
                          <strong>
                            <HighlightedText
                              text={item.title}
                              ranges={result.ranges}
                            />
                          </strong>
                          {item.subtitle && <small>{item.subtitle}</small>}
                        </span>
                        <CornerDownLeft
                          className="command-palette-enter"
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {query.trim() && !flat.length && !searchingPeople && (
            <div className="command-palette-empty">
              <strong>No results for “{query.trim()}”</strong>
              <span>
                {error
                  ? "People search is unavailable right now. Pages and sections still work."
                  : "Try the first letters of a page, section, or person's name."}
              </span>
            </div>
          )}
        </div>

        <div className="command-palette-footer" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </div>
        <p className="sr-only" aria-live="polite">
          {query.trim()
            ? `${flat.length} result${flat.length === 1 ? "" : "s"}`
            : ""}
        </p>
      </div>
    </div>
  );
}
