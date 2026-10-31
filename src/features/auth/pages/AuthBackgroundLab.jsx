import { Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import AuthAnimatedBackground from "../components/AuthAnimatedBackground.jsx";

const backgrounds = [
  {
    id: "silk",
    name: "Plum Silk",
    note: "Recommended",
    description:
      "Slow satin folds in plum and warm champagne. Luxurious, calm, and strongly connected to premium salon care.",
    source: "React Bits · Silk",
  },
  {
    id: "aurora",
    name: "Rose Aurora",
    note: "Softest",
    description:
      "Pastel ribbons drift behind the story panel with a gentle glow. Modern and welcoming without distracting from sign-in.",
    source: "React Bits · Aurora",
  },
  {
    id: "threads",
    name: "Flowing Threads",
    note: "Most salon-specific",
    description:
      "Fine illuminated strands move like styled hair. Distinctive and relevant while remaining subtle enough for authentication.",
    source: "React Bits · Threads",
  },
  {
    id: "rays",
    name: "Champagne Rays",
    note: "Cleanest",
    description:
      "Soft golden light enters from the corner and moves slowly across a plum surface for a clean editorial atmosphere.",
    source: "React Bits · Light Rays",
  },
];

export default function AuthBackgroundLab() {
  const [selected, setSelected] = useState("silk");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const active = backgrounds.find((background) => background.id === selected);

  return (
    <main className="auth-background-lab">
      <header className="auth-background-lab-header container">
        <div>
          <span className="auth-background-eyebrow"><Sparkles size={15} /> Auth background studio</span>
          <h1>Choose the atmosphere behind your welcome.</h1>
          <p>
            Four React Bits-inspired backgrounds, tuned to SalonHub’s plum and
            champagne palette. The form remains quiet and readable while the
            story panel carries the motion.
          </p>
        </div>
        <span className="auth-background-live"><span /> Live preview</span>
      </header>

      <nav className="auth-background-options container" aria-label="Authentication background choices">
        {backgrounds.map((background, index) => (
          <button
            key={background.id}
            type="button"
            className="auth-background-option"
            data-active={selected === background.id}
            onClick={() => setSelected(background.id)}
            aria-pressed={selected === background.id}
          >
            <span className="auth-background-option-number">0{index + 1}</span>
            <span className="auth-background-option-copy">
              <strong>{background.name}</strong>
              <small>{background.note}</small>
            </span>
            {selected === background.id && <Check size={17} />}
          </button>
        ))}
      </nav>

      <section className="auth-background-preview container" data-background={selected}>
        <div className="auth-background-story">
          <AuthAnimatedBackground variant={selected} />
          <div className="auth-background-story-copy">
            <span>A better way to book</span>
            <h2>Trusted places. Simple plans. More room to grow.</h2>
            <p>
              Discover approved salons, book with confidence, and build your
              next chapter in Jordan’s beauty community.
            </p>
          </div>
          <div className="auth-background-story-footer">
            <span>Approved salons</span><span>Protected accounts</span><span>Made for Jordan</span>
          </div>
        </div>

        <div className="auth-background-form-panel">
          <div className="auth-background-form-card">
            <span className="auth-background-form-kicker">Sign in</span>
            <h2>Welcome back</h2>
            <p>Your SalonHub community is waiting.</p>
            <div className="ui-floating-field auth-background-demo-field">
              <input id="background-email" type="email" placeholder=" " />
              <label htmlFor="background-email">Email address</label>
            </div>
            <div className="auth-input-wrap auth-background-demo-field">
              <input
                id="background-password"
                type={passwordVisible ? "text" : "password"}
                placeholder=" "
              />
              <label htmlFor="background-password">Password</label>
              <button
                type="button"
                className="auth-password-toggle auth-background-demo-eye"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                onClick={() => setPasswordVisible((current) => !current)}
              >
                <span className="auth-password-toggle-pulse" aria-hidden="true" />
                <Eye className="auth-password-eye-open" aria-hidden="true" />
                <EyeOff className="auth-password-eye-closed" aria-hidden="true" />
              </button>
            </div>
            <button className="auth-background-signin" type="button">Sign in</button>
          </div>
        </div>
      </section>

      <section className="auth-background-choice container" aria-live="polite">
        <div><span>Current direction</span><h2>{active.name}</h2></div>
        <p>{active.description}</p>
        <span>{active.source}</span>
      </section>
    </main>
  );
}
