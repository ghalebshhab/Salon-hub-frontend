import useHiringPosts from "../hooks/useHiringPosts.js";

import HiringPostCard from "../components/HiringPostCard.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function HiringPosts() {
  const { posts, loading } = useHiringPosts();

  return (
    <section className="container section">
      <div className="section-title left">
        <h1>Open Hiring Posts</h1>
        <p>Barbers can join salons from active hiring posts.</p>
      </div>

      {loading ? (
        <Loading message="Finding career opportunities…" />
      ) : posts.length === 0 ? (
        <EmptyState title="No open hiring posts" message="Check again later." />
      ) : (
        <div className="hiring-grid">
          {posts.map((post) => (
            <HiringPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HiringPosts;
