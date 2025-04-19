import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  ChartBarBig,
  CircleUserRound,
  Sun,
  Moon,
  LogOut,
  FilePlus,
  Save,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LogoutConfirm } from "./LogoutConfirm";
import { useSidebar } from "@/context/SideBarContext";
import { SidebarNavItemProps } from "@/types/SidebarTypes";

// Navigation items
const navItems = [
  { to: "/dashboard", icon: <ChartLine className="h-5 w-5" />, label: "Dashboard" },
  { to: "/job-application-tracker", icon: <ChartBarBig className="h-5 w-5" />, label: "Job Application Tracker" },
  { to: "/contacts-tracker", icon: <CircleUserRound className="h-5 w-5" />, label: "Contacts" },
  { to: "/generate", icon: <FilePlus className="h-5 w-5" />, label: "Cover Letter Generator" },
  { to: "/saved", icon: <Save className="h-5 w-5" />, label: "Saved Cover Letters" },
];

// Individual nav item component
const SidebarNavItem: React.FC<SidebarNavItemProps> = React.memo(
  ({ to, icon, label, collapsed }) => (
    <Link to={to} className="w-full">
      <Button variant="ghost" className="w-full justify-start border-none">
        {icon}
        {!collapsed && <span className="ml-2 text-sm">{label}</span>}
      </Button>
    </Link>
  )
);

// Sausage menu icon


const SausageMenuIcon = () => (
  <svg width="36" height="44" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="5" width="30" height="3" rx="1.5" fill="currentColor" />
    <rect x="3" y="15" width="30" height="3" rx="1.5" fill="currentColor" />
    <rect x="3" y="25" width="30" height="3" rx="1.5" fill="currentColor" />
  </svg>
);

export function AppSidebar(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [logoutModal, setLogoutModal] = useState(false);

  // Sidebar classes
  const sidebarClasses = useMemo(() => {
    const base =
      "fixed top-0 left-0 h-full bg-zinc-50 dark:bg-zinc-900 border-r z-50 p-4 flex flex-col gap-6 shadow-lg transition-transform duration-300 ease-in-out";
    const transform = collapsed ? "-translate-x-full" : "translate-x-0";
    const width = collapsed ? "w-20 lg:w-20" : "w-64 lg:w-64";
    return `${base} ${transform} lg:translate-x-0 ${width}`;
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
    setLogoutModal(false);
  };

  return (
    <>
      {/* Mobile toggle: fixed to viewport */}
      <div className="lg:hidden fixed top-4 left-4 z-60">
        <Button
          variant="ghost"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Open menu" : "Close menu"}
          className="p-2"
        >
          <SausageMenuIcon />
        </Button>
      </div>

      {/* Overlay when open on mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={toggleCollapsed}
        />
      )}

      {/* Sidebar container */}
      <div className={sidebarClasses}>
        {/* Header / Logo */}
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

        {/* Nav & actions */}
        <div className="flex flex-col gap-4 flex-grow">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="self-start"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {collapsed ? (
            <hr className="border-gray-300 dark:border-gray-700 my-2" />
          ) : (
            <span className="text-sm text-muted-foreground">Navigation</span>
          )}

          {/* Navigation items */}
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
          ))}

          {/* Auth button */}
          {isAuthenticated ? (
            <Button
              onClick={() => setLogoutModal(true)}
              className="w-full justify-start flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && "Logout"}
            </Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button className="w-full justify-start">
                {!collapsed ? "Login" : <LogOut className="h-4 w-4" />}
              </Button>
            </Link>
          )}

          {/* Collapse toggle for lg+ */}
          <Button variant="outline" size="icon" onClick={toggleCollapsed} className="self-end">
            {collapsed ? ">" : "<"}
          </Button>
        </div>
      </div>

      {/* Logout confirmation */}
      <LogoutConfirm
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

