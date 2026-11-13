import { Link } from "react-router-dom";

const VARIANTS = new Set(["primary", "secondary", "danger", "success"]);

/**
 * Shared action control built on the .btn classes in buttons.css.
 *
 * - variant: "primary" | "secondary" | "danger" | "success"
 * - size: "md" (default) | "sm"
 * - to: renders a router <Link> instead of a <button>
 * - fullWidth: stretches to the container width
 *
 * Buttons default to type="button" so they never submit a form by accident;
 * pass type="submit" explicitly for form submission.
 */
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  to,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = [
    "btn",
    `btn-${VARIANTS.has(variant) ? variant : "primary"}`,
    size === "sm" && "btn-small",
    fullWidth && "full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to !== undefined) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
