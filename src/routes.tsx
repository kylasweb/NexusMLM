import { Navigate, RouteObject } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import InvestmentPlans from "./components/investments/InvestmentPlans";
import UserInvestments from "./components/investments/UserInvestments";
import CommissionsDashboard from "./components/commissions/CommissionsDashboard";
import NetworkVisualization from "./components/network/NetworkVisualization";
import UserProfile from "./components/profile/UserProfile";
import AdminDashboard from "./components/admin/AdminDashboard";
import KYCVerification from "./components/kyc/KYCVerification";
import Leaderboard from "./components/gamification/Leaderboard";
import WebsiteEditor from "./components/visual-editor/WebsiteEditor";
import TeamManagement from "./components/team/TeamManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/error-boundary";
import { useAuth } from "./lib/auth";

const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardOverview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordForm />,
  },
  {
    path: "/investments",
    element: (
      <ProtectedRoute>
        <InvestmentPlans />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-investments",
    element: (
      <ProtectedRoute>
        <UserInvestments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/commissions",
    element: (
      <ProtectedRoute>
        <CommissionsDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/network",
    element: (
      <ProtectedRoute>
        <NetworkVisualization />
      </ProtectedRoute>
    ),
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <TeamManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/kyc",
    element: (
      <ProtectedRoute>
        <KYCVerification />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/website-editor",
    element: (
      <ProtectedRoute>
        <WebsiteEditor />
      </ProtectedRoute>
    ),
  },
];

export default routes;
