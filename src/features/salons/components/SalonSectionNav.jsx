import { useEffect, useState } from "react";
import { SALON_SECTIONS } from "../model/salonPage.js";
import useSectionJump from "../hooks/useSectionJump.js";

/** A section is "current" once its top passes this line under the tabs. */
const ACTIVE_LINE_PX = 160;

function currentSection() {
  // At the end of the page the last section cannot scroll up to the line,
  // so it is current once its bottom is in view.
  const last = SALON_SECTIONS[SALON_SECTIONS.length - 1].id;
  const lastNode = document.getElementById(last);
  if (
    lastNode &&
    lastNode.getBoundingClientRect().top < window.innerHeight &&
    lastNode.getBoundingClientRect().bottom <= window.innerHeight
  ) {
    return last;
  }
  let current = SALON_SECTIONS[0].id;
  for (const { id } of SALON_SECTIONS) {
    const node = document.getElementById(id);
    if (node && node.getBoundingClientRect().top <= ACTIVE_LINE_PX) {
      current = id;
    }
  }
  return current;
}

/**
 * Sticky in-page tabs. The tab of the section on screen is marked, so
 * visitors always know where they are on a long page.
 */
export default function SalonSectionNav() {
  const [active, setActive] = useState(SALON_SECTIONS[0].id);
  const jump = useSectionJump();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(currentSection()));
    };
    update();
    // Capture: the page may scroll inside a container, not the window.
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav className="sn" aria-label="Salon page sections">
      <ul>
        {SALON_SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={active === id ? "is-active" : undefined}
              aria-current={active === id ? "location" : undefined}
              onClick={jump(id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
