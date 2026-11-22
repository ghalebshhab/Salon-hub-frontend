import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { frequentlyAskedQuestions } from "../content/homeContent.js";
import t from "../../../shared/i18n/t.js";

export default function HomeFaqSection() {
  return (
    <section className="editorial-section container" id="questions">
      <ScrollReveal className="editorial-section-heading centered">
        <div>
          <span className="editorial-index">{t("06 / Good to know")}</span>
          <h2>{t("Clear answers before you begin.")}</h2>
        </div>
      </ScrollReveal>
      <div className="editorial-faq-grid">
        {frequentlyAskedQuestions.map(({ question, answer }, index) => (
          <ScrollReveal
            className="editorial-faq-card"
            delay={(index % 2) * 75}
            key={question}
          >
            <span>0{index + 1}</span>
            <div>
              <h3>{t(question)}</h3>
              <p>{t(answer)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
