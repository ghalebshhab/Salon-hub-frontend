import { useEffect, useState } from "react";

const EDGE_GAP = 24;

const px = (value, fallback) => {
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : fallback;
};

/**
 * Sets the sticky `top` of a side column so the whole column stays in view:
 * centred in the space under the sticky header and tabs when it fits, and
 * pinned by its bottom edge when it is taller (so the last card shows).
 * Writes the value to the `--sticky-top` CSS variable on the element.
 */
export default function useCenteredSticky() {
  // A callback ref: the column mounts after the page data loads.
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return undefined;

    const update = () => {
      const styles = getComputedStyle(element);
      const offset =
        px(styles.getPropertyValue("--sp-header"), 70) +
        px(styles.getPropertyValue("--sp-tabs"), 56);
      const room = window.innerHeight - offset;
      const height = element.offsetHeight;
      const top =
        height + EDGE_GAP * 2 <= room
          ? offset + (room - height) / 2
          : window.innerHeight - height - EDGE_GAP;
      element.style.setProperty("--sticky-top", `${Math.round(top)}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [element]);

  return setElement;
}
