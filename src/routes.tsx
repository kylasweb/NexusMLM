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
import TokenManagement from "./components/tokens/TokenManagement";
import FaucetManagement from "./components/tokens/FaucetManagement";
import AirdropManagement from "./components/tokens/AirdropManagement";
import UserTokens from "./components/tokens/UserTokens";
import TokenClaimPage from "./components/tokens/TokenClaimPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/error-boundary";
import PlanManagement from "./components/admin/PlanManagement";
import AdminRoute from "./components/auth/AdminRoute";

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
        <AdminRoute>
          <WebsiteEditor />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  // Token Management Routes
  {
    path: "/tokens/manage",
    element: (
      <ProtectedRoute>
        <TokenManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tokens/faucets",
    element: (
      <ProtectedRoute>
        <FaucetManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tokens/airdrops",
    element: (
      <ProtectedRoute>
        <AirdropManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tokens/my-tokens",
    element: (
      <ProtectedRoute>
        <UserTokens />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tokens/claim",
    element: (
      <ProtectedRoute>
        <TokenClaimPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/plans",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <PlanManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
];

export default routes;
