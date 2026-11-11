export default function CommunityFeedHeading({ postCount }) {
  return (
    <header className="community-feed-heading">
      <div>
        <span className="community-card-kicker">Community / Latest</span>
        <h2 id="community-feed-title">From people you can grow with</h2>
      </div>
      <span className="community-feed-rule" aria-hidden="true" />
      <small aria-live="polite">{postCount} {postCount === 1 ? "post" : "posts"}</small>
    </header>
  );
}
