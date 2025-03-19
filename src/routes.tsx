import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/Home";

const routes = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
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
