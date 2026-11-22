/**
 * The fixed text of each sign-in page. The page and its loading skeleton
 * both read it, so the skeleton's lines wrap exactly like the page's text in
 * every language. Values are English keys for t().
 */
export const AUTH_COPY = {
  login: {
    eyebrow: "Sign in",
    title: "Welcome back",
    intro:
      "Your next appointment, your saved places, and your SalonHub community are waiting.",
    inline: ["Secure access to your account", "Forgot password?"],
    note: [
      "Your profile keeps bookings, salon relationships, and career progress in one place.",
    ],
    footer: ["New to SalonHub?", "Create an account", "Verify email"],
  },
  register: {
    eyebrow: "Join the community",
    title: "Make room for what’s next",
    intro:
      "Create one SalonHub account to book great services, manage a salon, or grow your career.",
    hint: ["Use the password rules required by your SalonHub account."],
    note: [
      "Your normal user profile is created automatically. You can upgrade to a career profile later—no career fields are needed here.",
    ],
    footer: ["Already have an account?", "Sign in"],
  },
  verifyEmail: {
    codeHint:
      "The code contains exactly six digits and expires after 10 minutes.",
    eyebrow: "Secure your account",
    title: "Verify your email",
    intro:
      "Enter the six-digit code sent to your email. This keeps your account and salon activity protected.",
    footer: ["Already verified?", "Sign in"],
  },
  forgotPassword: {
    eyebrow: "Account recovery",
    title: "Reset your password",
    intro:
      "Tell us which account you need to recover. We’ll send a short-lived verification code if the email belongs to an account.",
    note: [
      "For your privacy, SalonHub shows the same response whether or not an account exists for this email.",
    ],
    footer: ["Remembered your password?", "Back to sign in"],
  },
  verifyResetCode: {
    codeHint: "The code expires after 10 minutes and can only be used once.",
    eyebrow: "Account recovery",
    title: "Check your inbox",
    intro:
      "Enter the six-digit recovery code. After it is verified, you can choose a new password.",
    footer: ["Need another code?", "Start again"],
  },
  resetPassword: {
    eyebrow: "Account recovery",
    title: "Choose a new password",
    intro:
      "Use a strong password you have not used before. Your existing signed-in sessions will no longer be valid.",
    footer: ["Return to sign in"],
    status: [
      "Verify a current password reset code before choosing a new password.",
      "Request a code",
    ],
  },
  accountSecurity: {
    eyebrow: "Account security",
    title: "Change your password",
    intro:
      "Confirm your current password, then choose a strong replacement. Every signed-in session will be invalidated after this change.",
    hint: [
      "Use at least eight characters with an uppercase letter, a number, and a special character.",
    ],
    note: [
      "Cannot remember the current password?",
      "Verify your account and reset it",
    ],
  },
};
