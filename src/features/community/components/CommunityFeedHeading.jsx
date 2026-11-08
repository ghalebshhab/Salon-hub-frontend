export default function CommunityFeedHeading({ postCount }) {
  return (
    <header className="community-feed-heading">
      <div>
        <span className="community-card-kicker">Community / Latest</span>
        <h2>From people you can grow with</h2>
      </div>
      <span className="community-feed-rule" />
      <small>{postCount} posts</small>
    </header>
  );
}
