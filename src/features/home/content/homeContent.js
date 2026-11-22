import t from "../../../shared/i18n/t.js";
export const platformFeatures = [
  {
    number: "01",
    icon: "salon",
    title: t("Trusted salon discovery"),
    text: t(
      "Explore administrator-approved salons with useful location, schedule, service, and team details.",
    ),
  },
  {
    number: "02",
    icon: "booking",
    title: t("Clear booking decisions"),
    text: t(
      "Request an appointment and follow every pending, accepted, changed, rejected, or cancelled update.",
    ),
  },
  {
    number: "03",
    icon: "profile",
    title: t("One professional profile"),
    text: t(
      "Turn your account into a career profile with skills, experience, preferred locations, portfolio, and an optional resume.",
    ),
  },
  {
    number: "04",
    icon: "career",
    title: t("Thoughtful hiring"),
    text: t(
      "See suggested openings or compare applicants by matched requirements, extra strengths, and missing details.",
    ),
  },
];

export const ownerSteps = [
  t("Create a complete salon profile and submit it for review."),
  t("Publish services, schedules, team details, and hiring posts."),
  t("Review bookings and applicants with the context you need."),
  t("Keep customers and candidates informed through persistent notifications."),
];

export const frequentlyAskedQuestions = [
  {
    question: t("Can I explore salons before creating an account?"),
    answer: t(
      "Yes. The public directory shows approved, active salons. Sign in when you are ready to book, apply, or manage a salon.",
    ),
  },
  {
    question: t("How does SalonHub recommend opportunities?"),
    answer: t(
      "Your age, preferred location, skills, and experience are compared with each opening. Stronger matches appear first while every eligible post stays visible.",
    ),
  },
  {
    question: t("What happens after I request an appointment?"),
    answer: t(
      "The salon can accept, reject, suggest a new time, reassign an employee, or cancel. You receive a saved notification for every decision.",
    ),
  },
  {
    question: t("How are salons kept trustworthy?"),
    answer: t(
      "A salon becomes public only after administrator approval. Owners can correct a rejected submission and resubmit it up to three times.",
    ),
  },
];
