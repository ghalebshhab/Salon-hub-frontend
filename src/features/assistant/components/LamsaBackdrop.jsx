/**
 * The background of the chat page: one soft plum light behind the orb and
 * a faint dot texture that fades out, nothing else. It uses one color, so
 * the orb and the words stay the only things the eye goes to.
 *
 * The light breathes slowly, and it warms a little while Lamsa writes.
 * It is decoration only (aria-hidden, no pointer events).
 */
export default function LamsaBackdrop({ thinking = false }) {
  return (
    <div
      className={`lamsa-backdrop ${thinking ? "is-thinking" : ""}`.trim()}
      aria-hidden="true"
    />
  );
}
