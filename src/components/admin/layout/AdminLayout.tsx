import React, { useState } from "react";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300",
            sidebarCollapsed ? "ml-20" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
