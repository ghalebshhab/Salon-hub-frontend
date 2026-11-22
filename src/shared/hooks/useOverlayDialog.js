import { useEffect, useRef } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour for a dialog drawn as a div overlay (role="dialog").
 * While it is mounted: focus moves into the dialog, Tab stays inside it,
 * Escape closes it, and on close focus goes back to the control that opened
 * it. For a native <dialog>, use useModalDialog instead.
 *
 * Put the returned ref on the element with role="dialog".
 */
export default function useOverlayDialog(onClose, { locked = false } = {}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  const lockedRef = useRef(locked);

  useEffect(() => {
    closeRef.current = onClose;
    lockedRef.current = locked;
  }, [onClose, locked]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const opener = document.activeElement;
    const focusables = () => [...dialog.querySelectorAll(FOCUSABLE)];

    // A text field is the likely next step; otherwise the first control.
    const first =
      dialog.querySelector("textarea:not([disabled]), input:not([disabled])") ??
      focusables()[0];
    (first ?? dialog).focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (!lockedRef.current) closeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    };
    dialog.addEventListener("keydown", onKeyDown);

    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  return dialogRef;
}
