import { Check } from "lucide-react";
import { liveStageIndex } from "../../model/booking.js";

const STAGES = ["Confirmed", "On the way", "Arrived", "In service", "Done"];

export default function LiveTimeline({ tracking }) {
  const current = liveStageIndex(tracking);
  return (
    <ol className="live-timeline" aria-label="Appointment progress">
      {STAGES.map((label, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "next";
        return (
          <li
            key={label}
            className={`is-${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="live-timeline-dot" aria-hidden="true">
              {state === "done" && <Check size={11} />}
            </span>
            <span className="live-timeline-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
