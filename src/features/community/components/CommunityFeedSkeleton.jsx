export default function CommunityFeedSkeleton() {
  return (
    <div
      className="community-feed-skeletons"
      role="status"
      aria-label="Loading community posts"
      aria-busy="true"
    >
      {[0, 1].map((item) => (
        <article className="community-feed-skeleton" key={item} aria-hidden="true">
          <div className="community-skeleton-author">
            <span />
            <div><i /><i /></div>
          </div>
          <i className="community-skeleton-line" />
          <i className="community-skeleton-line is-short" />
          <i className="community-skeleton-block" />
        </article>
      ))}
      <span className="sr-only">Loading posts…</span>
    </div>
  );
}
