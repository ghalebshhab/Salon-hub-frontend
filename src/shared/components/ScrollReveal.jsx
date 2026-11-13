import { useEffect, useLayoutEffect, useRef, useState } from "react";

function isInInitialViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function ScrollReveal({
  as: Element = "div",
  children,
  className = "",
  delay = 0,
}) {
  const elementRef = useRef(null);
  // "hidden" → waits for the viewport; "instant" → on screen at first paint;
  // "revealed" → animated in after scrolling into view.
  const [state, setState] = useState("hidden");

  // Runs before paint so above-the-fold content never flashes or animates in.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setState("instant");
      return;
    }
    if (isInInitialViewport(element)) setState("instant");
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (
      !element ||
      state !== "hidden" ||
      !("IntersectionObserver" in window) ||
      isInInitialViewport(element)
    )
      return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("revealed");
        observer.unobserve(entry.target);
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [state]);

  const stateClass =
    state === "instant"
      ? "is-visible is-instant"
      : state === "revealed"
        ? "is-visible"
        : "";

  return (
    <Element
      ref={elementRef}
      className={`scroll-reveal ${stateClass} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Element>
  );
}

export default ScrollReveal;
