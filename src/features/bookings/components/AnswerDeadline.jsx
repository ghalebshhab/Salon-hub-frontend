import { Hourglass } from "lucide-react";
import useNow from "../../../shared/hooks/useNow.js";
import {
  formatDeadline,
  formatTimeLeft,
  getAnswerDeadline,
} from "../model/booking.js";
import t from "../../../shared/i18n/t.js";

/**
 * How long the salon has to answer a pending request.
 * `audience="owner"` asks the salon to act; `audience="customer"` sets the
 * customer's expectation. Renders nothing when there is no open deadline.
 */
export default function AnswerDeadline({ booking, audience = "customer" }) {
  const now = useNow();
  const info = getAnswerDeadline(booking, now);
  if (!info) return null;

  const when = formatDeadline(info.deadline, now);
  const tone = info.overdue ? "is-overdue" : info.urgent ? "is-urgent" : "";
  let text;
  if (audience === "owner") {
    text = info.overdue
      ? t("The answer time is over. This request will expire.")
      : t("Answer by {when} · {timeLeft}", {
          when,
          timeLeft: formatTimeLeft(info.msLeft),
        });
  } else {
    text = info.overdue
      ? t("The salon did not answer in time. This request will expire.")
      : t(
          "The salon answers by {when}. If not, the request expires and you can book again.",
          { when },
        );
  }

  return (
    <p className={`answer-deadline ${tone}`} role="status">
      <Hourglass size={15} aria-hidden="true" />
      <span>{t(text)}</span>
    </p>
  );
}
