import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogoutConfirm } from "./LogoutConfirm";
import { useSidebar } from "@/context/SideBarContext";
import { SidebarNavItemProps } from "@/types/SidebarTypes";
import { refreshCsrfToken } from "@/utils/refreshCSRFToken";
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
  X,
} from "lucide-react";

// Navigation items
const navItems = [
  { to: "/dashboard", icon: <ChartLine className="h-4 w-5" />, label: "Dashboard" },
  { to: "/job-application-tracker", icon: <ChartBarBig className="h-4 w-4" />, label: "Job Application Tracker" },
  { to: "/contacts-tracker", icon: <CircleUserRound className="h-4 w-4" />, label: "Contacts" },
  { to: "/generate", icon: <FilePlus className="h-4 w-4" />, label: "Cover Letter Generator" },
  { to: "/saved", icon: <Save className="h-4 w-4" />, label: "Saved Cover Letters" },
];

// Sidebar item component
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

// Sausage menu icon for mobile
const SausageMenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="1.5" rx="0.75" fill="currentColor" />
    <rect x="2" y="9" width="16" height="1.5" rx="0.75" fill="currentColor" />
    <rect x="2" y="14" width="16" height="1.5" rx="0.75" fill="currentColor" />
  </svg>
);

export function AppSidebar(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { isMobile, collapsed, toggleCollapsed } = useSidebar();
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const sidebarClasses = useMemo(() => {
    const base = `fixed top-0 left-0 h-full bg-zinc-50 dark:bg-zinc-900 border-r z-[110] p-4 flex flex-col gap-6 shadow-lg ${isMobile ? "transform transition duration-300" : "transition-all duration-300"
      }`;
    const transform = collapsed ? "-translate-x-full" : "translate-x-0";
    const width = collapsed ? "w-20 lg:w-20" : "w-64 lg:w-64";
    return `${base} ${transform} lg:translate-x-0 ${width}`;
  }, [collapsed, isMobile]);

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await logout();
      setLogoutModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      {collapsed && (
        <nav className="lg:hidden fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl px-2 flex items-center">
          <Button
            variant="ghost"
            onClick={toggleCollapsed}
            aria-label="Open menu"
            className="p-2"
          >
            <SausageMenuIcon />
          </Button>
        </nav>
      )}

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={toggleCollapsed}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
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
          {!collapsed && isMobile && (
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleCollapsed}
              className="p-1"
              aria-label="Collapse sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-grow mt-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="self-start"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Navigation label */}
          {collapsed ? (
            <hr className="border-gray-300 dark:border-gray-700 my-2" />
          ) : (
            <span className="text-sm text-muted-foreground">Navigation</span>
          )}

          {/* Nav Items */}
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
          ))}

          {/* Auth Actions */}
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

          {/* Collapse toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCollapsed}
            className="self-start"
          >
            {collapsed ? ">" : "<"}
          </Button>
        </div>
      </div>

      {/* Logout Confirm Dialog */}
      <LogoutConfirm
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

