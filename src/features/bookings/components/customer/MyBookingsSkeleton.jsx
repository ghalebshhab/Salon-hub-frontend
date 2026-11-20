/** Placeholder cards while the bookings load, so the layout does not jump. */
export default function MyBookingsSkeleton({ count = 3 }) {
  return (
    <div
      className="mb-list"
      aria-busy="true"
      aria-label="Loading your bookings"
    >
      {Array.from({ length: count }, (_, index) => (
        <div className="mb-card is-skeleton" key={index}>
          <span className="mb-date skeleton-block" />
          <div className="mb-card-main">
            <span className="skeleton-block mb-skel-title" />
            <span className="skeleton-block mb-skel-line" />
            <span className="skeleton-block mb-skel-line is-short" />
          </div>
        </div>
      ))}
    </div>
  );
}
