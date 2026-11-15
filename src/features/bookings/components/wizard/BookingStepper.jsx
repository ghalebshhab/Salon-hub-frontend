import { Check } from "lucide-react";

/** Progress for the booking wizard. Finished steps can be revisited. */
export default function BookingStepper({ steps, current, onSelect }) {
  return (
    <ol className="bk-stepper" aria-label="Booking steps">
      {steps.map((step, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "next";
        return (
          <li key={step.key} className={`bk-step is-${state}`}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              disabled={index > current}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="bk-step-dot" aria-hidden="true">
                {state === "done" ? <Check size={14} /> : index + 1}
              </span>
              <span className="bk-step-label">{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
