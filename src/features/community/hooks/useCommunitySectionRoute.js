import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { COMMUNITY_SECTION_TARGETS } from "../model/communityRoutes.js";

/**
 * After switching community sections, bring the section's start into view
 * (only if the tabs scrolled away) and move focus to its main control:
 * the people search on Discover, the composer on Create post.
 */
export default function useCommunitySectionRoute() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    const section = COMMUNITY_SECTION_TARGETS[pathname];
    const isFirst = firstRender.current;
    firstRender.current = false;
    if (!section) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const tabs = document.querySelector(".community-tabs");
      if (!isFirst && tabs && tabs.getBoundingClientRect().top < 0) {
        tabs.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const target = document.getElementById(section.id);
      const focusTarget = section.focusId
        ? document.getElementById(section.focusId)
        : section.focusSelector
          ? target?.querySelector(section.focusSelector)
          : null;
      focusTarget?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
}
