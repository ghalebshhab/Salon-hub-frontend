import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ScrollReveal from "./ScrollReveal.jsx";

let observerCallback;

function installObserver() {
  observerCallback = undefined;
  window.IntersectionObserver = class {
    constructor(callback) {
      observerCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

function mockRect(top, bottom) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom,
    left: 0,
    right: 100,
    width: 100,
    height: bottom - top,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  delete window.IntersectionObserver;
});

function revealElement() {
  return screen.getByText("Content").closest(".scroll-reveal");
}

it("shows content immediately when IntersectionObserver is unavailable", () => {
  render(<ScrollReveal>Content</ScrollReveal>);
  expect(revealElement().className).toContain("is-visible is-instant");
});

it("shows above-the-fold content without an entrance animation", () => {
  installObserver();
  mockRect(100, 300);
  render(<ScrollReveal>Content</ScrollReveal>);
  expect(revealElement().className).toContain("is-visible is-instant");
});

it("animates below-the-fold content once it scrolls into view", () => {
  installObserver();
  mockRect(window.innerHeight + 200, window.innerHeight + 400);
  render(<ScrollReveal delay={75}>Content</ScrollReveal>);

  const element = revealElement();
  expect(element.className).not.toContain("is-visible");
  expect(element.style.getPropertyValue("--reveal-delay")).toBe("75ms");

  act(() => observerCallback([{ isIntersecting: true, target: element }]));
  expect(element.className).toContain("is-visible");
  expect(element.className).not.toContain("is-instant");
});
