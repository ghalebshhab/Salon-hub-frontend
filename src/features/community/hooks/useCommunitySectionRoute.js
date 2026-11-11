import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  COMMUNITY_ROUTES,
  COMMUNITY_SECTION_TARGETS,
} from "../model/communityRoutes.js";

export default function useCommunitySectionRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    const section = COMMUNITY_SECTION_TARGETS[pathname];
    if (!section || pathname === COMMUNITY_ROUTES.feed) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(section.id);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });

      const focusTarget = section.focusId
        ? document.getElementById(section.focusId)
        : target?.querySelector(section.focusSelector);
      focusTarget?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
}
