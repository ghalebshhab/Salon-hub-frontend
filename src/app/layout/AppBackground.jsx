/**
 * The background behind every app page: soft salon daylight.
 *
 * - light: a plum wash from the top right, like light from a window;
 * - warm: a low gold glow at the bottom left, the brand accent;
 * - grain: a fine paper texture, so flat areas do not look digital.
 *
 * It sits behind the content, so it never lowers text contrast, and it
 * is plain CSS: no canvas and no script. Colors come from the theme
 * variables, so light and dark mode need no code here.
 */
export default function AppBackground() {
  return (
    <div className="app-backdrop" aria-hidden="true">
      <span className="app-backdrop-light" />
      <span className="app-backdrop-warm" />
      <span className="app-backdrop-grain" />
    </div>
  );
}
