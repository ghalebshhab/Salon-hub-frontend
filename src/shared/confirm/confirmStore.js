// Promise-based confirmation for hooks and event handlers, shown with the
// shared ConfirmDialog by <ConfirmHost />. Replaces window.confirm/prompt.
//
//   if (!(await confirmAction({ title: "Delete post?", danger: true }))) return;
//   const reason = await confirmAction({ title: "Reject?", input: { label: "Reason", required: true } });

let current = null;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export function subscribeConfirm(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getConfirmSnapshot = () => current;

/**
 * Opens the dialog. Resolves true (or the typed text when `input` is set)
 * on confirm, and false (or null with `input`) on cancel.
 */
export function confirmAction(options = {}) {
  // A new question replaces an open one; the old one counts as cancelled.
  if (current) current.resolve(current.options.input ? null : false);
  return new Promise((resolve) => {
    current = {
      options,
      resolve: (result) => {
        current = null;
        emit();
        resolve(result);
      },
    };
    emit();
  });
}
