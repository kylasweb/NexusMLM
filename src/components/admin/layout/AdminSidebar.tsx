import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutDashboard,
  Settings,
  DollarSign,
  Award,
  PiggyBank,
  FileText,
  Bell,
  Shield,
  Globe,
  BarChart,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const adminNavItems = [
    {
      group: "Core",
      items: [
        {
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          href: "/admin",
        },
        {
          icon: <Users size={20} />,
          label: "User Management",
          href: "/admin/users",
        },
      ],
    },
    {
      group: "MLM Management",
      items: [
        {
          icon: <PiggyBank size={20} />,
          label: "Investment Plans",
          href: "/admin/plans",
        },
        {
          icon: <Award size={20} />,
          label: "Rank Management",
          href: "/admin/ranks",
        },
        {
          icon: <DollarSign size={20} />,
          label: "Commissions",
          href: "/admin/commissions",
        },
      ],
    },
    {
      group: "Financial",
      items: [
        {
          icon: <BarChart size={20} />,
          label: "Transactions",
          href: "/admin/transactions",
        },
        {
          icon: <DollarSign size={20} />,
          label: "Withdrawals",
          href: "/admin/withdrawals",
        },
      ],
    },
    {
      group: "System",
      items: [
        {
          icon: <Settings size={20} />,
          label: "System Settings",
          href: "/admin/settings",
        },
        {
          icon: <Shield size={20} />,
          label: "KYC Verification",
          href: "/admin/kyc",
        },
        {
          icon: <Bell size={20} />,
          label: "Notifications",
          href: "/admin/notifications",
        },
        {
          icon: <FileText size={20} />,
          label: "Reports",
          href: "/admin/reports",
        },
        {
          icon: <Globe size={20} />,
          label: "Website Settings",
          href: "/admin/website",
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border z-40 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-border">
        {collapsed ? (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
        ) : (
          <span className="text-xl font-bold">Admin Panel</span>
        )}
      </div>

      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        {adminNavItems.map((group, idx) => (
          <div key={idx} className="py-4">
            {!collapsed && (
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.group}
              </h3>
            )}
            <nav className="mt-2">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center"
                    )
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;

