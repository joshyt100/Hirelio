import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  Moon,
  ChartBarBig,
  CircleUserRound,
  Sun,
  LogOut,
  FilePlus,
  Save,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LogoutConfirm } from "./LogoutConfirm";
import { useSidebar } from "@/context/SideBarContext";

const navItems = [
  { to: "/dashboard", icon: <ChartLine className="h-5 w-5" />, label: "Dashboard" },
  { to: "/job-application-tracker", icon: <ChartBarBig className="h-5 w-5" />, label: "Job Application Tracker" },
  { to: "/contacts-tracker", icon: <CircleUserRound className="h-5 w-5" />, label: "Contacts" },
  { to: "/generate", icon: <FilePlus className="h-5 w-5" />, label: "Cover Letter Generator" },
  { to: "/saved", icon: <Save className="h-5 w-5" />, label: "Saved Cover Letters" },
];

const SidebarNavItem = React.memo(
  ({ to, icon, label, collapsed }: { to: string; icon: React.ReactNode; label: string; collapsed: boolean }) => (
    <Link to={to} className="w-full">
      <Button variant="ghost" className="w-full justify-start border-none">
        {icon}
        {!collapsed && <span className="ml-2 text-sm">{label}</span>}
      </Button>
    </Link>
  )
);

export function AppSidebar(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [logoutModal, setLogoutModal] = useState(false);

  const sidebarClass = useMemo(() => {
    return `fixed top-0 left-0 h-full ${collapsed ? "w-20" : "w-64"} bg-zinc-50 dark:bg-zinc-900 border-r z-50 p-4 flex flex-col gap-6 shadow-lg transition-all duration-300 ease-in-out`;
  }, [collapsed]);

  const handleLogoutModal = () => setLogoutModal(true);
  const handleLogout = async () => {
    await logout();
    setLogoutModal(false);
  };

  return (
    <>
      <div className={sidebarClass} style={{ willChange: "width" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <Link to="/generate" className="text-xl font-bold">
                HireMind
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 items-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="border-none rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {collapsed ? (
            <hr className="w-full border border-gray-300 dark:border-gray-700 my-2" />
          ) : (
            <h1 className="text-sm text-muted-foreground">Navigation</h1>
          )}

          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
          ))}

          {!isLoading && (
            isAuthenticated ? (
              <Button onClick={handleLogoutModal} className="w-full justify-start flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {!collapsed && "Logout"}
              </Button>
            ) : (
              <Link to="/login" className="w-full">
                <Button className="w-full justify-start">
                  {!collapsed ? "Login" : <LogOut className="h-4 w-4" />}
                </Button>
              </Link>
            )
          )}

          {/* Collapse Toggle */}
          <Button variant="outline" size="icon" onClick={toggleCollapsed} className="mt-auto">
            {collapsed ? ">" : "<"}
          </Button>
        </div>
      </div>

      <LogoutConfirm open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}

