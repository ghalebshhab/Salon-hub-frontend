import { UserRoundPlus } from "lucide-react";
import usePeopleSearchField from "../hooks/usePeopleSearchField.js";
import PeopleSearchField from "./PeopleSearchField.jsx";
import PeopleSearchResults from "./PeopleSearchResults.jsx";

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
  const searchField = usePeopleSearchField(onSearch);

  return (
    <section
      className="community-discovery community-panel"
      id="discover"
      tabIndex={-1}
      aria-labelledby="discovery-title"
    >
      <div className="community-discovery-heading">
        <div className="community-discovery-title">
          <span className="community-panel-icon">
            <UserRoundPlus size={18} aria-hidden="true" />
          </span>
          <div>
            <span className="community-card-kicker">Your network</span>
            <h2 id="discovery-title">Discover people</h2>
          </div>
        </div>
        <span className="community-discovery-count" role="status" aria-live="polite">
          {loading
            ? "Searching"
            : `${people.length} ${people.length === 1 ? "person" : "people"}`}
        </span>
      </div>

      <PeopleSearchField
        value={searchField.value}
        inputRef={searchField.inputRef}
        loading={loading}
        onChange={searchField.setValue}
        onSubmit={searchField.submit}
        onClear={searchField.clear}
      />
      <div
        className="community-discovery-results"
        id="community-people-results"
        aria-live="polite"
        aria-busy={loading}
      >
        <PeopleSearchResults
          people={people}
          search={searchField.normalizedValue}
          loading={loading}
          error={error}
          busy={busy}
          onRetry={onRetry}
          onConnect={onConnect}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </div>
    </section>
  );
}
