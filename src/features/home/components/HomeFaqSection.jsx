import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { frequentlyAskedQuestions } from "../content/homeContent.js";

export default function HomeFaqSection() {
  return (
    <section className="editorial-section container" id="questions">
      <ScrollReveal className="editorial-section-heading centered">
        <div>
          <span className="editorial-index">05 / Good to know</span>
          <h2>Clear answers before you begin.</h2>
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
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
