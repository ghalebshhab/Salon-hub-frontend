import { useEffect, useState } from "react";
import { searchCommunityPeopleApi } from "../../features/community/api/communityRelationshipsApi.js";
import { requireData } from "../../shared/api/response.js";
import { normalizeQuery } from "../../shared/search/searchModel.js";

const DELAY_MS = 140;

/**
 * Members whose name or username starts with the query (server-side,
 * case-insensitive). Every typed character narrows the list; stale
 * responses are aborted and never overwrite newer ones.
 */
export default function usePeopleSearch(query, enabled) {
  const normalized = normalizeQuery(query);
  const [state, setState] = useState({ query: "", people: [], error: false });
  const active = enabled && normalized.length > 0;

  useEffect(() => {
    if (!active) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await searchCommunityPeopleApi(normalized, {
          signal: controller.signal,
        });
        const members = requireData(response) || [];
        setState({
          query: normalized,
          people: members.map((member) => member.user).filter(Boolean),
          error: false,
        });
      } catch {
        if (!controller.signal.aborted)
          setState({ query: normalized, people: [], error: true });
      }
    }, DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [active, normalized]);

  const current = active && state.query === normalized;
  return {
    people: current ? state.people : [],
    loading: active && !current,
    error: current && state.error,
  };
}
