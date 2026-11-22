import { matchPath, useLocation } from "react-router-dom";
import PageSkeleton from "../../shared/components/PageSkeleton.jsx";
import AuthPageSkeleton from "../../features/auth/components/AuthPageSkeleton.jsx";
import HomeSkeleton from "../../features/home/components/HomeSkeleton.jsx";
import SalonPageSkeleton from "../../features/salons/components/SalonPageSkeleton.jsx";
import {
  CreateSalonSkeleton,
  EditSalonSkeleton,
  MySalonSkeleton,
} from "../../features/salons/components/OwnerSalonSkeletons.jsx";
import OwnerDashboardSkeleton from "../../features/dashboard/components/OwnerDashboardSkeleton.jsx";
import MyBookingsPageSkeleton from "../../features/bookings/components/customer/MyBookingsPageSkeleton.jsx";
import {
  EmployeeBookingsSkeleton,
  SalonBookingsSkeleton,
} from "../../features/bookings/components/BookingsPageSkeletons.jsx";
import BookingWizardSkeleton from "../../features/bookings/components/wizard/BookingWizardSkeleton.jsx";
import {
  SalonServicesSkeleton,
  ServiceFormSkeleton,
} from "../../features/services/components/ServicesPageSkeletons.jsx";
import {
  ApplicationsReviewSkeleton,
  EmployeeSetupSkeleton,
  SalonTeamSkeleton,
} from "../../features/employees/components/EmployeesPageSkeletons.jsx";
import {
  ApplyHiringSkeleton,
  CreateHiringPostSkeleton,
  HiringPostsSkeleton,
} from "../../features/hiring/components/HiringSkeletons.jsx";
import MyApplicationsSkeleton from "../../features/applications/components/MyApplicationsSkeleton.jsx";
import CareerProfileSkeleton from "../../features/profile/components/CareerProfileSkeleton.jsx";
import {
  EmploymentCenterSkeleton,
  OwnerEmploymentSkeleton,
} from "../../features/employment/components/EmploymentSkeletons.jsx";
import {
  CommunityProfileSkeleton,
  CommunitySkeleton,
} from "../../features/community/components/CommunitySkeletons.jsx";
import NotificationsSkeleton from "../../features/notifications/components/NotificationsSkeleton.jsx";
import SettingsSkeleton from "../../features/settings/components/SettingsSkeleton.jsx";
import PaymentsSkeleton from "../../features/payments/components/PaymentsSkeleton.jsx";
import PlanSkeleton from "../../features/subscriptions/components/PlanSkeleton.jsx";
import AssistantPageSkeleton from "../../features/assistant/components/AssistantPageSkeleton.jsx";

const auth = (form) => () => <AuthPageSkeleton form={form} />;

/**
 * Which skeleton each address shows while its page code (or the account
 * check) loads. Every skeleton copies its real page layout, so nothing jumps
 * when the page appears. The first matching path wins.
 */
const ROUTE_SKELETONS = [
  { path: "/", Skeleton: HomeSkeleton },
  { path: "/login", Skeleton: auth("login") },
  { path: "/register", Skeleton: auth("register") },
  { path: "/verify-email", Skeleton: auth("verifyEmail") },
  { path: "/forgot-password", Skeleton: auth("forgotPassword") },
  { path: "/verify-reset-code", Skeleton: auth("verifyResetCode") },
  { path: "/reset-password", Skeleton: auth("resetPassword") },
  { path: "/account/security", Skeleton: auth("accountSecurity") },
  { path: "/assistant", Skeleton: AssistantPageSkeleton },
  { path: "/settings", Skeleton: SettingsSkeleton },
  { path: "/salons/:salonId", Skeleton: SalonPageSkeleton },
  { path: "/salons/:salonId/book", Skeleton: BookingWizardSkeleton },
  { path: "/my-bookings", Skeleton: MyBookingsPageSkeleton },
  { path: "/notifications", Skeleton: NotificationsSkeleton },
  { path: "/community/people/:userId", Skeleton: CommunityProfileSkeleton },
  { path: "/community/*", Skeleton: CommunitySkeleton },
  { path: "/community", Skeleton: CommunitySkeleton },
  { path: "/employment", Skeleton: EmploymentCenterSkeleton },
  { path: "/hiring-posts", Skeleton: HiringPostsSkeleton },
  { path: "/hiring-posts/:postId/apply", Skeleton: ApplyHiringSkeleton },
  { path: "/profile/career", Skeleton: CareerProfileSkeleton },
  { path: "/my-applications", Skeleton: MyApplicationsSkeleton },
  { path: "/owner/dashboard", Skeleton: OwnerDashboardSkeleton },
  { path: "/owner/employment", Skeleton: OwnerEmploymentSkeleton },
  { path: "/owner/create-hiring-post", Skeleton: CreateHiringPostSkeleton },
  { path: "/owner/applications", Skeleton: ApplicationsReviewSkeleton },
  { path: "/owner/services", Skeleton: SalonServicesSkeleton },
  { path: "/owner/create-service", Skeleton: ServiceFormSkeleton },
  {
    path: "/owner/services/:serviceId/edit",
    Skeleton: () => <ServiceFormSkeleton edit />,
  },
  { path: "/owner/payments", Skeleton: PaymentsSkeleton },
  { path: "/owner/plan", Skeleton: PlanSkeleton },
  { path: "/owner/bookings", Skeleton: SalonBookingsSkeleton },
  { path: "/owner/employees", Skeleton: SalonTeamSkeleton },
  {
    path: "/owner/employees/:employeeId/setup",
    Skeleton: EmployeeSetupSkeleton,
  },
  { path: "/owner/create-salon", Skeleton: CreateSalonSkeleton },
  { path: "/owner/my-salon", Skeleton: MySalonSkeleton },
  { path: "/owner/my-salon/edit", Skeleton: EditSalonSkeleton },
  { path: "/employee/bookings", Skeleton: EmployeeBookingsSkeleton },
];

/** The skeleton for an address; an unknown address gets the plain one. */
export function SkeletonForPath({ pathname }) {
  const match = ROUTE_SKELETONS.find((route) =>
    matchPath({ path: route.path, end: true }, pathname),
  );
  const Skeleton = match?.Skeleton ?? PageSkeleton;
  return <Skeleton />;
}

/** The skeleton of the page at the current address. */
export default function RouteSkeleton() {
  const { pathname } = useLocation();
  return <SkeletonForPath pathname={pathname} />;
}
