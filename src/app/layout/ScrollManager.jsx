import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());
  const previousLocation = useRef({
    key: location.key,
    pathname: location.pathname,
    hash: location.hash,
  });

  useEffect(() => {
    const savePosition = () =>
      positions.current.set(location.key, window.scrollY);
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, [location.key]);

  useEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = {
      key: location.key,
      pathname: location.pathname,
      hash: location.hash,
    };

    if (
      previous.pathname === location.pathname &&
      previous.hash === location.hash
    ) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      if (navigationType === "POP") {
        window.scrollTo({
          top: positions.current.get(location.key) ?? 0,
          behavior: "auto",
        });
        return;
      }

      const reducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;
      // A new page starts at the top at once; only a jump inside the same page
      // (a #section link) glides, so the reader sees where it went.
      const samePage = previous.pathname === location.pathname;
      const behavior = reducedMotion || !samePage ? "auto" : "smooth";
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1));
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior, block: "start" });
          return;
        }
      }

      window.scrollTo({
        top: 0,
        behavior,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key, location.pathname, navigationType]);

  return null;
}
