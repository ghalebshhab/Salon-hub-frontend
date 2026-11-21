import { useEffect } from "react";

/** How much of the remaining distance each frame covers (0–1). Lower is softer. */
const EASE = 0.1;
/** Stop the animation when this close to the target, in pixels. */
const SETTLE_PX = 0.5;
const LINE_PX = 40;

const canScroll = (node, deltaY) => {
  const { overflowY } = getComputedStyle(node);
  if (!/(auto|scroll|overlay)/.test(overflowY)) return false;
  if (node.scrollHeight <= node.clientHeight) return false;
  return deltaY < 0
    ? node.scrollTop > 0
    : node.scrollTop + node.clientHeight < node.scrollHeight - 1;
};

/** The wheel belongs to an inner scroll area, a dialog or a zoom gesture. */
function leaveToBrowser(event) {
  if (event.ctrlKey || event.defaultPrevented) return true;
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return true;
  const root = document.documentElement;
  if (
    getComputedStyle(root).overflowY === "hidden" ||
    getComputedStyle(document.body).overflowY === "hidden"
  ) {
    return true;
  }
  for (
    let node = event.target;
    node && node !== document.body && node !== root;
    node = node.parentElement
  ) {
    if (node.closest?.('[role="dialog"], [aria-modal="true"], dialog')) {
      return true;
    }
    if (canScroll(node, event.deltaY)) return true;
  }
  return false;
}

/**
 * Soft, eased mouse-wheel scrolling for long pages. Only for a mouse or
 * trackpad on a fine pointer; touch, keyboard, scrollbar dragging and
 * reduced-motion users keep the browser's own scrolling.
 */
export default function useSmoothWheel() {
  useEffect(() => {
    const media = window.matchMedia?.(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!media?.matches) return undefined;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    // The global `scroll-behavior: smooth` would animate each small step.
    root.style.scrollBehavior = "auto";

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;

    const maxScroll = () => root.scrollHeight - window.innerHeight;

    const step = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < SETTLE_PX) current = target;
      window.scrollTo(0, current);
      frame = current === target ? 0 : requestAnimationFrame(step);
    };

    const onWheel = (event) => {
      if (leaveToBrowser(event)) return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1
          ? LINE_PX
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      if (!frame) {
        // Start from where the page really is (keyboard, links, scrollbar).
        current = window.scrollY;
        target = current;
      }
      target = Math.max(0, Math.min(maxScroll(), target + event.deltaY * unit));
      if (!frame) frame = requestAnimationFrame(step);
    };

    // Another scroll (a tab jump, the keyboard) takes over: stop ours.
    const onUserScroll = () => {
      if (frame && Math.abs(window.scrollY - current) > 2) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onUserScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onUserScroll);
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);
}
