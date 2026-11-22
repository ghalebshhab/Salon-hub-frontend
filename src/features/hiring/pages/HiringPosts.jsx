import useHiringPosts from "../hooks/useHiringPosts.js";

import HiringPostCard from "../components/HiringPostCard.jsx";
import { HiringCardsBones } from "../components/HiringSkeletons.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function HiringPosts() {
  const { posts, loading } = useHiringPosts();

  return (
    <section className="container section">
      <div className="section-title left">
        <h1>{t(PAGE_HEADS.hiringPosts.title)}</h1>
        <p>{t(PAGE_HEADS.hiringPosts.text)}</p>
      </div>

      {loading ? (
        <HiringCardsBones />
      ) : posts.length === 0 ? (
        <EmptyState
          title={t("No open hiring posts")}
          message={t("Check again later.")}
        />
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
