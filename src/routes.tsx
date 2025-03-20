import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import ReportsManagement from "./components/admin/ReportsManagement";
import NotificationManagement from "./components/admin/NotificationManagement";
import WebsiteSettings from "./components/admin/WebsiteSettings";

const routes = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  // User dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardOverview />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  // Admin routes
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UserManagement />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <AdminRoute>
        <ReportsManagement />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <AdminRoute>
        <NotificationManagement />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/website",
    element: (
      <AdminRoute>
        <WebsiteSettings />
      </AdminRoute>
    ),
  },
]);

export default routes;
