import { Check } from "lucide-react";
import { liveStageIndex } from "../../model/booking.js";
import t from "../../../../shared/i18n/t.js";

const STAGES = [
  t("Confirmed"),
  t("On the way"),
  t("Arrived"),
  t("In service"),
  t("Done"),
];

export default function LiveTimeline({ tracking }) {
  const current = liveStageIndex(tracking);
  return (
    <ol className="live-timeline" aria-label={t("Appointment progress")}>
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
            <span className="live-timeline-label">{t(label)}</span>
          </li>
        );
      })}
    </ol>
  );
}
