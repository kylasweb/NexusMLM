import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  PiggyBank,
  UserPlus,
  Award,
  Shield,
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "View Network",
      description: "Explore your binary matrix structure",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      href: "/network",
      color: "bg-blue-50",
    },
    {
      title: "Manage Team",
      description: "View and manage your team members",
      icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
      href: "/team",
      color: "bg-indigo-50",
    },
    {
      title: "Investment Plans",
      description: "Browse available investment opportunities",
      icon: <PiggyBank className="h-6 w-6 text-purple-600" />,
      href: "/investments",
      color: "bg-purple-50",
    },
    {
      title: "Commissions",
      description: "Track your earnings and withdrawals",
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      href: "/commissions",
      color: "bg-green-50",
    },
    {
      title: "Leaderboard",
      description: "See top performers and challenges",
      icon: <Award className="h-6 w-6 text-amber-600" />,
      href: "/leaderboard",
      color: "bg-amber-50",
    },
    {
      title: "KYC Verification",
      description: "Complete your identity verification",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      href: "/kyc",
      color: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Link key={index} to={action.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-full ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{action.title}</h3>
                <p className="text-gray-500 text-sm">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
