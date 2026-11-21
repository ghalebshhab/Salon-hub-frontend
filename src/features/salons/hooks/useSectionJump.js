import { useCallback } from "react";

/**
 * In-page links for the salon page.
 *
 * A plain `href="#id"` and a router navigation both count as a page change
 * here: React Router reads the hash change as a back/forward step (the
 * scroll manager then restores the old position) and the app shows its
 * page-change overlay. So this scrolls to the section itself and only
 * rewrites the address bar, keeping the router's history state.
 */
export default function useSectionJump() {
  return useCallback(
    (id) => (event) => {
      const target = document.getElementById(id);
      if (!target) return;
      event?.preventDefault();
      const reducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(window.history.state, "", `#${id}`);
      }
    },
    [],
  );
}
