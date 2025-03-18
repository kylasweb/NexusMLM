import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Network,
  Users,
  PiggyBank,
  DollarSign,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  Award,
  Shield,
  Layout,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = ({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
}: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="block">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-12",
                active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center px-0" : "",
              )}
            >
              {icon}
              {!collapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = ({ className, collapsed = false }: SidebarProps) => {
  const location = useLocation();
  const activePath = location.pathname;

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Network size={20} />,
      label: "Network Visualization",
      href: "/network",
    },
    { icon: <Users size={20} />, label: "Team Management", href: "/team" },
    {
      icon: <PiggyBank size={20} />,
      label: "Investment Plans",
      href: "/investments",
    },
    {
      icon: <PiggyBank size={20} />,
      label: "My Investments",
      href: "/my-investments",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Commissions",
      href: "/commissions",
    },
    {
      icon: <Award size={20} />,
      label: "Leaderboard",
      href: "/leaderboard",
    },
    { icon: <UserCircle size={20} />, label: "Profile", href: "/profile" },
    { icon: <Shield size={20} />, label: "KYC Verification", href: "/kyc" },
    { icon: <Settings size={20} />, label: "Admin Panel", href: "/admin" },
    {
      icon: <Layout size={20} />,
      label: "Website Editor",
      href: "/website-editor",
    },
  ];

  const bottomNavItems = [
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      href: "/support",
    },
    { icon: <LogOut size={20} />, label: "Logout", href: "/logout" },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-background border-r border-border",
        collapsed ? "w-16" : "w-64 lg:w-72",
        "transition-all duration-300 ease-in-out",
        className,
      )}
    >
      <div className="p-4 flex justify-center items-center h-20 border-b border-border">
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
        ) : (
          <div className="text-xl font-bold">Zocial MLM</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={item.href === activePath}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-border py-4 px-3">
        <nav className="space-y-1">
          {bottomNavItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
