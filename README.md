# SalonHub frontend

React + Vite frontend for salon discovery, appointment booking, hiring applications, and salon management. The existing visual design and route URLs are preserved.

## Local development

Use Node.js 24 LTS (minimum 22.12) and npm.

```sh
npm ci
npm run dev
```

The development API defaults to `http://localhost:8080/api`. Copy `.env.example` to `.env.local` to override `VITE_API_BASE_URL`. Restart Vite after changing environment values. All `VITE_*` values are public and must not contain secrets.

## Commands

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Local development server                                  |
| `npm run lint`         | ESLint, including React hooks and architecture boundaries |
| `npm run test`         | Regression tests with Vitest and Testing Library          |
| `npm run test:watch`   | Tests during development                                  |
| `npm run build`        | Production output in `dist/`                              |
| `npm run preview`      | Preview the production bundle locally                     |
| `npm run check`        | Lint, tests, and production build                         |
| `npm run format`       | Apply consistent formatting                               |
| `npm run format:check` | Check formatting without edits                            |

GitHub Actions runs the checks on Linux, including exact-case import validation.

## Structure and responsibilities

```text
src/
  app/                  Composition, routes, layout, and ordered global styles
  features/
    auth/               Login and registration
    bookings/           Customer, employee, and owner booking flows
    dashboard/          Owner navigation
    employees/          Invitations and application management
    hiring/             Hiring posts and applications
    home/               Landing page
    media/              Salon photos and videos
    reviews/            Ratings and booking reviews
    salons/             Public profiles and owner salon management
    services/           Salon service management
  shared/
    api/                HTTP transport and response envelope handling
    auth/               Session persistence and reactive subscriptions
    components/         Reusable visual primitives and error boundary
    config/             Public environment configuration
    hooks/              Request lifecycle management
    notifications/      Toast presentation adapter
    utils/              General formatting helpers
  test/                 Test setup and architectural regression checks
```

Each feature contains only the layers it needs:

- `pages/` and `components/` render the design and forward user events.
- `hooks/` coordinate form state, data loading, navigation, and mutations.
- `api/` owns endpoint paths and HTTP payload contracts.
- `model/` contains pure business rules and payload mapping.

Dependencies flow from app to features to shared. Shared code cannot import features or app code. Views cannot import API modules. Pure model functions cannot import React, HTTP, or notifications. ESLint enforces these boundaries. Cross-feature composition uses another feature's specific component or API adapter; avoid importing another feature's page or hook internals.

These boundaries apply single responsibility without adding inheritance or speculative service interfaces. New features extend the route composition and use small modules. The shared query hook accepts a loader instead of knowing any endpoint, making lifecycle behavior independent of the transport. Pure model functions can be tested without React.

## Request and session behavior

`useQuery` accepts a stable loader and supplies an AbortSignal. GET adapters forward the signal to Axios. Navigation, loader changes, and refreshes abort obsolete requests; late responses cannot overwrite the current resource. Hooks call `refetch` after successful mutations. Optional employee/media data can fail without hiding an otherwise valid salon profile.

The HTTP client has a 15-second timeout and adds bearer authentication to protected requests. A 401 from the current token clears the session; a 403 preserves it. A late 401 for an older token cannot clear a newer login. Session changes update navigation and route guards in the current tab and across tabs. Login returns users to their requested route.

The existing backend token contract uses localStorage. Route guards provide navigation behavior; the backend must enforce authorization for every operation. Owner and employee roles are not inferred from undocumented token fields.

## Styling

`src/app/styles/index.css` imports the original stylesheet sections in their original order. Global selectors remain unchanged to preserve the design and cascade. Keep new feature styles scoped by their component classes and avoid reordering these imports without visual review.

## Deployment

1. Run `npm ci` and `npm run check`.
2. Build with `VITE_API_BASE_URL` pointing to the deployed API, or use the production default `/api` with a same-origin reverse proxy.
3. Serve `dist/` over HTTPS. Rewrite frontend routes to `index.html` so deep links such as `/owner/services` work. Do not rewrite `/api` requests to the SPA.
4. If the API is on a different origin, configure its CORS policy for the frontend origin.

Pages are lazy-loaded. The app has route-loading, not-found, and render-error fallbacks. Vite preview is for local verification, not the production web server.

## Verification scope

Tests cover every existing route with mocked API responses, login redirects, authentication subscriptions, 401/403 handling, stale request cancellation, refresh/recovery, service validation, salon payload contracts, and local booking dates. They do not replace acceptance testing against a running backend with real customer, employee, and owner accounts.

## Project status and related repository

Active development. SalonHub aims to provide a clean, responsive user experience with reusable components and maintainable backend integration.

Backend: [Salon Booking App](https://github.com/ghalebshhab/Salon-Booking-App-Backend-Refinment)

## Author

**Ghaleb Shhab** — [GitHub](https://github.com/ghalebshhab) · [LinkedIn](https://www.linkedin.com/in/ghaleb-shhab/)
