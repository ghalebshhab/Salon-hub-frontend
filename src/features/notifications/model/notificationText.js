import {
  dateLocale,
  getCurrentLanguage,
} from "../../../shared/i18n/language.js";

/**
 * The server writes notification messages in English, with names, dates and
 * times inside the sentence. In Arabic we match each known sentence and
 * rebuild it in Jordanian Arabic with the same values. A message that does
 * not match (a new sentence on the server) is shown as it is.
 */

const DATE = "(\\d{4}-\\d{2}-\\d{2})";
const TIME = "(\\d{1,2}:\\d{2}(?::\\d{2})?)";
const ANY = "(.+?)";

function arDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(dateLocale(), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const arTime = (value) => String(value).slice(0, 5);

const arMoney = (value) => String(value).replace(/\bJOD\b/g, "د.أ");

function arWhen(value) {
  let match = value.match(new RegExp(`^today at ${TIME}$`));
  if (match) return `اليوم الساعة ${arTime(match[1])}`;
  match = value.match(new RegExp(`^tomorrow at ${TIME}$`));
  if (match) return `بكرا الساعة ${arTime(match[1])}`;
  match = value.match(new RegExp(`^on ${DATE} at ${TIME}$`));
  if (match) return `يوم ${arDate(match[1])} الساعة ${arTime(match[2])}`;
  return value;
}

const REMINDER_SUFFIX = {
  " Share your trip when you leave so the salon knows when you arrive.":
    " شارك مشوارك لما تطلع عشان الصالون يعرف إمتى رح توصل.",
  " Please confirm that you are coming, or cancel early if your plans change.":
    " أكّد إنك جاي، أو ألغِ بكير إذا تغيّرت خططك.",
};

const d = arDate;
const tm = arTime;

/** [English pattern, function that builds the Arabic text from the groups]. */
const PATTERNS = [
  [
    `Your booking at ${ANY} on ${DATE} at ${TIME} was accepted\\.`,
    (s, a, b) => `انقبل حجزك بـ ${s} يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `Your booking at ${ANY} on ${DATE} at ${TIME} was rejected\\.`,
    (s, a, b) => `انرفض حجزك بـ ${s} يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `Your booking at ${ANY} was reassigned to ${ANY}\\.`,
    (s, e) => `حجزك بـ ${s} صار مع ${e}.`,
  ],
  [
    `${ANY} proposed moving your booking to ${DATE} at ${TIME}\\.`,
    (s, a, b) => `${s} اقترح ينقل حجزك ليوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `${ANY} accepted the new appointment on ${DATE} at ${TIME}\\.`,
    (c, a, b) => `${c} وافق عالموعد الجديد يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `Your assigned booking at ${ANY} moved to ${DATE} at ${TIME}\\.`,
    (s, a, b) =>
      `الحجز المعيّن إلك بـ ${s} انتقل ليوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `${ANY} rejected the proposed appointment on ${DATE} at ${TIME}\\.`,
    (c, a, b) => `${c} رفض الموعد المقترح يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `${ANY} requested an appointment on ${DATE} at ${TIME}\\. Choose who will serve the customer\\.`,
    (c, a, b) =>
      `${c} طلب موعد يوم ${d(a)} الساعة ${tm(b)}. اختار مين رح يخدم الزبون.`,
  ],
  [
    `${ANY} requested an appointment on ${DATE} at ${TIME}\\. Requested employee: ${ANY}\\.`,
    (c, a, b, e) =>
      `${c} طلب موعد يوم ${d(a)} الساعة ${tm(b)}. الموظف المطلوب: ${e}.`,
  ],
  [
    `You will serve ${ANY} on ${DATE} at ${TIME}\\.`,
    (c, a, b) => `رح تخدم ${c} يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `${ANY} is on the way, about (\\d+) min away\\.`,
    (c, m) => `${c} عالطريق، بعيد حوالي ${m} دقيقة.`,
  ],
  [`${ANY} is on the way\\.`, (c) => `${c} عالطريق.`],
  [`${ANY} arrived at the salon\\.`, (c) => `${c} وصل الصالون.`],
  [
    `Your stylist started your service at ${ANY}\\.`,
    (s) => `المختص بلّش خدمتك بـ ${s}.`,
  ],
  [
    `${ANY} started your service at ${ANY}\\.`,
    (e, s) => `${e} بلّش خدمتك بـ ${s}.`,
  ],
  [
    `Your appointment at ${ANY} is complete\\. Share a review to help other guests\\.`,
    (s) => `موعدك بـ ${s} خلص. اكتب تقييم عشان تساعد الزباين الثانيين.`,
  ],
  [
    `${ANY} did not answer your request for ${DATE} at ${TIME} in time\\. The request expired; you can book another time\\.`,
    (s, a, b) =>
      `${s} ما رد على طلبك ليوم ${d(a)} الساعة ${tm(b)} بالوقت. الطلب انتهى، وبتقدر تحجز وقت ثاني.`,
  ],
  [
    `The request from ${ANY} for ${DATE} at ${TIME} expired without an answer\\.`,
    (c, a, b) => `طلب ${c} ليوم ${d(a)} الساعة ${tm(b)} انتهى بدون رد.`,
  ],
  [
    `${ANY} confirmed they will come on ${DATE} at ${TIME}\\.`,
    (c, a, b) => `${c} أكّد إنه جاي يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `Reminder: your appointment at ${ANY} is (today at ${TIME}|tomorrow at ${TIME}|on ${DATE} at ${TIME})\\.( .+)?`,
    (s, when, ...rest) =>
      `تذكير: موعدك بـ ${s} ${arWhen(when)}.${REMINDER_SUFFIX[rest[rest.length - 1]] || ""}`,
  ],
  [
    `Coming up: ${ANY} (today at ${TIME}|tomorrow at ${TIME}|on ${DATE} at ${TIME})\\.`,
    (c, when) => `موعد قريب: ${c} ${arWhen(when)}.`,
  ],
  [
    `${ANY} marked your appointment on ${DATE} at ${TIME} as missed\\. Contact the salon if this is a mistake\\.`,
    (s, a, b) =>
      `${s} سجّل موعدك يوم ${d(a)} الساعة ${tm(b)} كغياب. تواصل مع الصالون إذا في غلط.`,
  ],
  [
    `${ANY} received your payment of ${ANY}\\. Your receipt is ready in My bookings\\.`,
    (s, m) => `${s} استلم دفعتك ${arMoney(m)}. إيصالك جاهز بصفحة حجوزاتي.`,
  ],
  [
    `Get ready: leave for ${ANY} in about (\\d+) min\\. The drive takes about (\\d+) min and your turn is expected at ${ANY}\\.`,
    (s, m, drive, at) =>
      `جهّز حالك: اطلع على ${s} بعد حوالي ${m} دقيقة. المشوار بياخذ حوالي ${drive} دقيقة ودورك متوقع الساعة ${at}.`,
  ],
  [
    `Leave now for ${ANY}\\. With the traffic now you arrive at about ${ANY}; your turn is expected at ${ANY}\\.`,
    (s, arrive, at) =>
      `اطلع هسّا على ${s}. مع الزحمة هسّا رح توصل حوالي الساعة ${arrive}، ودورك متوقع الساعة ${at}.`,
  ],
  [
    `Time to leave for ${ANY}\\. The drive takes about (\\d+) min with the traffic now, so you arrive at ${ANY}, before your turn at ${ANY}\\.`,
    (s, drive, arrive, at) =>
      `صار وقت تطلع على ${s}. المشوار بياخذ حوالي ${drive} دقيقة مع الزحمة هسّا، فرح توصل الساعة ${arrive}، قبل دورك الساعة ${at}.`,
  ],
  [
    `${ANY} is running about (\\d+) min late\\. Your turn is now expected at ${ANY}, so you can leave later\\.`,
    (s, m, at) =>
      `${s} متأخر حوالي ${m} دقيقة. دورك صار متوقع الساعة ${at}، فبتقدر تطلع بعدين.`,
  ],
  [
    `${ANY} cancelled the booking at ${ANY} on ${DATE} at ${TIME}\\.`,
    (c, s, a, b) => `${c} ألغى الحجز بـ ${s} يوم ${d(a)} الساعة ${tm(b)}.`,
  ],
  [
    `Your salon request for "${ANY}" was submitted and is waiting for admin review\\.`,
    (s) => `طلب صالونك "${s}" انبعت وبستنى مراجعة الإدارة.`,
  ],
  [
    `Your updated salon request for "${ANY}" was resubmitted and is waiting for admin review\\.`,
    (s) => `طلب صالونك المعدّل "${s}" انبعت مرة ثانية وبستنى مراجعة الإدارة.`,
  ],
  [
    `Your updated salon request for "${ANY}" was accepted after review\\. Your salon is now active\\.`,
    (s) => `طلب صالونك المعدّل "${s}" انقبل بعد المراجعة. صالونك صار فعّال.`,
  ],
  [
    `Your salon request for "${ANY}" was accepted\\. Your salon is now active\\.`,
    (s) => `طلب صالونك "${s}" انقبل. صالونك صار فعّال.`,
  ],
  [
    `Your salon request for "${ANY}" was rejected\\. Reason: ([\\s\\S]*)`,
    (s, reason) => `طلب صالونك "${s}" انرفض. السبب: ${reason}`,
  ],
  [
    `Your salon "${ANY}" was blocked by an administrator\\. Owner access is temporarily disabled\\.`,
    (s) => `صالونك "${s}" انحظر من الإدارة. صلاحيات صاحب الصالون موقفة مؤقتًا.`,
  ],
  [
    `Your salon "${ANY}" was unblocked\\. Your salon data and owner access have been restored\\.`,
    (s) => `صالونك "${s}" انفك حظره. معلومات صالونك وصلاحياتك رجعت.`,
  ],
  [`${ANY} sent you a friend request\\.`, (n) => `${n} بعتلك طلب صداقة.`],
  [`${ANY} accepted your friend request\\.`, (n) => `${n} قبل طلب صداقتك.`],
  [`${ANY} declined your friend request\\.`, (n) => `${n} رفض طلب صداقتك.`],
].map(([source, build]) => [new RegExp(`^${source}$`), build]);

/** The notification message in the current language. */
export function notificationMessage(message) {
  if (!message || getCurrentLanguage() !== "ar") return message;
  const text = String(message).trim();
  for (const [pattern, build] of PATTERNS) {
    const match = text.match(pattern);
    if (match) return build(...match.slice(1));
  }
  return message;
}
