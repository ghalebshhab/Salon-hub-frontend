import { useEffect, useRef } from "react";

/**
 * Opens a native <dialog> as a modal while the component is mounted.
 * The browser gives focus trapping and the top layer; this hook adds
 * Escape / backdrop-click closing and stops the page from scrolling behind it.
 */
export default function useModalDialog(onClose, { locked = false } = {}) {
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
    // React unmounts the dialog, so the browser cannot restore focus by itself.
    const opener = document.activeElement;
    if (!dialog.open) dialog.showModal?.();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onCancel = (event) => {
      event.preventDefault();
      if (!lockedRef.current) closeRef.current?.();
    };
    const onClick = (event) => {
      if (event.target === dialog && !lockedRef.current) closeRef.current?.();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
      if (dialog.open) dialog.close?.();
      root.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  return dialogRef;
}
