import { Sparkles } from "lucide-react";

export default function CommunityEmptyFeed() {
  return (
    <section className="community-panel community-empty">
      <Sparkles size={28} />
      <h2>The community is ready for its first story.</h2>
      <p>Share a recent transformation, tip, or salon update.</p>
    </section>
  );
}
