import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import ProtectedRoute from "../layout/ProtectedRoute.jsx";
import NotFound from "./NotFound.jsx";
const Home = lazy(() => import("../../features/home/pages/Home.jsx"));
const SalonDetails = lazy(
  () => import("../../features/salons/pages/SalonDetails.jsx"),
);
const HiringPosts = lazy(
  () => import("../../features/hiring/pages/HiringPosts.jsx"),
);
const Login = lazy(() => import("../../features/auth/pages/Login.jsx"));
const Register = lazy(() => import("../../features/auth/pages/Register.jsx"));
const ApplyHiringPost = lazy(
  () => import("../../features/hiring/pages/ApplyHiringPost.jsx"),
);
const CreateBooking = lazy(
  () => import("../../features/bookings/pages/CreateBooking.jsx"),
);
const MyBookings = lazy(
  () => import("../../features/bookings/pages/MyBookings.jsx"),
);
const EmployeeBookings = lazy(
  () => import("../../features/bookings/pages/EmployeeBookings.jsx"),
);
const SalonBookings = lazy(
  () => import("../../features/bookings/pages/SalonBookings.jsx"),
);
const OwnerDashboard = lazy(
  () => import("../../features/dashboard/pages/OwnerDashboard.jsx"),
);
const CreateSalon = lazy(
  () => import("../../features/salons/pages/CreateSalon.jsx"),
);
const MySalon = lazy(() => import("../../features/salons/pages/MySalon.jsx"));
const CreateHiringPost = lazy(
  () => import("../../features/hiring/pages/CreateHiringPost.jsx"),
);
const CreateMediaPost = lazy(
  () => import("../../features/media/pages/CreateMediaPost.jsx"),
);
const MySalonServices = lazy(
  () => import("../../features/services/pages/MySalonServices.jsx"),
);
const AddSalonService = lazy(
  () => import("../../features/services/pages/AddSalonService.jsx"),
);
const EditSalonService = lazy(
  () => import("../../features/services/pages/EditSalonService.jsx"),
);
const MySalonEmployees = lazy(
  () => import("../../features/employees/pages/MySalonEmployees.jsx"),
);
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
        <Route path="/hiring-posts" element={<HiringPosts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/hiring-posts/:postId/apply"
            element={<ApplyHiringPost />}
          />
          <Route path="/salons/:salonId/book" element={<CreateBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/employee/bookings" element={<EmployeeBookings />} />
          <Route path="/owner/bookings" element={<SalonBookings />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/create-salon" element={<CreateSalon />} />
          <Route path="/owner/my-salon" element={<MySalon />} />
          <Route
            path="/owner/create-hiring-post"
            element={<CreateHiringPost />}
          />
          <Route
            path="/owner/create-media-post"
            element={<CreateMediaPost />}
          />
          <Route path="/owner/services" element={<MySalonServices />} />
          <Route path="/owner/create-service" element={<AddSalonService />} />
          <Route
            path="/owner/services/:serviceId/edit"
            element={<EditSalonService />}
          />
          <Route path="/owner/employees" element={<MySalonEmployees />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
