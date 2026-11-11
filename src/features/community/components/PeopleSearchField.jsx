import { LoaderCircle, Search, X } from "lucide-react";

export default function PeopleSearchField({
  value,
  inputRef,
  loading,
  onChange,
  onSubmit,
  onClear,
}) {
  return (
    <form className="community-search" onSubmit={onSubmit} role="search">
      <Search size={19} aria-hidden="true" />
      <label className="sr-only" htmlFor="community-people-search">
        Search by name or username
      </label>
      <input
        id="community-people-search"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name or @username"
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
      {value && (
        <button
          className="community-search-clear"
          type="button"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={17} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
