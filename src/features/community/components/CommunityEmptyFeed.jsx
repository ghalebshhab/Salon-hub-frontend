import { Sparkles } from "lucide-react";
import t from "../../../shared/i18n/t.js";

export default function CommunityEmptyFeed() {
  return (
    <section className="community-panel community-empty">
      <Sparkles size={28} />
      <h2>{t("The community is ready for its first story.")}</h2>
      <p>{t("Share a recent transformation, tip, or salon update.")}</p>
    </section>
  );
}
