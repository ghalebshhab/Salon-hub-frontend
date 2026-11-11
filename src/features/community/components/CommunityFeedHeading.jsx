export default function CommunityFeedHeading({ postCount }) {
  return (
    <header className="community-feed-heading">
      <div>
        <span className="community-card-kicker">Latest conversations</span>
        <h2 id="community-feed-title">Community feed</h2>
        <p>Fresh stories, ideas, and work from across SalonHub.</p>
      </div>
      <small className="community-feed-count" aria-live="polite">{postCount} {postCount === 1 ? "post" : "posts"}</small>
    </header>
  );
}
