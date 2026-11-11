import { LoaderCircle, RotateCw, Search, UsersRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import FriendshipActions from "./FriendshipActions.jsx";

export default function PeopleDiscoveryPanel({
  people,
  busy,
  loading,
  error,
  onSearch,
  onRetry,
  onConnect,
  onAccept,
  onDecline,
}) {
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const previousSearchRef = useRef(search);
  const normalizedSearch = search.trim().replace(/\s+/g, " ");

  useEffect(() => {
    if (previousSearchRef.current === normalizedSearch) return;
    previousSearchRef.current = normalizedSearch;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => onSearch(normalizedSearch), 350);
    return () => window.clearTimeout(timerRef.current);
  }, [normalizedSearch, onSearch]);

  const submit = (event) => {
    event.preventDefault();
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    window.clearTimeout(timerRef.current);
    onSearch(normalizedSearch);
  };

  const clearSearch = () => {
    window.clearTimeout(timerRef.current);
    setSearch("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <section
      className="community-discovery community-panel"
      id="discover"
      tabIndex={-1}
      aria-labelledby="discovery-title"
    >
      <div className="community-discovery-heading">
        <div>
          <span className="community-card-kicker">Grow your circle</span>
          <h2 id="discovery-title">
            <UsersRound size={19} aria-hidden="true" /> Find people
          </h2>
          <p>Meet the artists and professionals shaping the beauty community.</p>
        </div>
        <span className="community-discovery-count" role="status" aria-live="polite">
          {loading
            ? "Searching"
            : `${people.length} ${people.length === 1 ? "person" : "people"}`}
        </span>
      </div>
      <form className="community-search" onSubmit={submit} role="search">
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="community-people-search">
          Search by name or username
        </label>
        <input
          id="community-people-search"
          ref={inputRef}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or @username"
          autoComplete="off"
          aria-controls="community-people-results"
          aria-describedby="community-search-hint"
        />
        <span id="community-search-hint" className="sr-only">
          Results update as you type. Press Enter to search immediately.
        </span>
        {loading && (
          <span className="community-search-spinner" role="status" aria-label="Searching">
            <LoaderCircle className="community-spinning" size={19} aria-hidden="true" />
          </span>
        )}
        {search && (
          <button
            className="community-search-clear"
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={17} aria-hidden="true" />
          </button>
        )}
      </form>
      <div
        className="community-discovery-results"
        id="community-people-results"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <p className="community-discovery-message">Finding people in the community…</p>
        ) : error ? (
          <div className="community-discovery-message is-error" role="alert">
            <span>We couldn&apos;t load people right now.</span>
            <button type="button" onClick={onRetry}>
              <RotateCw size={15} aria-hidden="true" /> Try again
            </button>
          </div>
        ) : people.length ? (
          <>
            <p className="community-discovery-caption">
              {normalizedSearch ? "Search results" : "Suggested professionals"}
            </p>
            <ul className="community-people-grid">
              {people.map((member) => (
                <li className="community-person-row" key={member.user.id}>
                  <CommunityProfileLink user={member.user} size="small" />
                  <FriendshipActions
                    member={member}
                    busy={busy}
                    onConnect={onConnect}
                    onAccept={onAccept}
                    onDecline={onDecline}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="community-discovery-message">
            {normalizedSearch
              ? "No people found. Try a different name or username."
              : "No suggestions yet. Search by name or username to find your people."}
          </p>
        )}
      </div>
    </section>
  );
}
