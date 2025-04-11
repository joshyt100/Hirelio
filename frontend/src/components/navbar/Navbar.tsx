import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { Button } from "@/components/ui/button";
import { FileText, ChartLine, Moon, ChartBarBig, CircleUserRound, Sun, LogOut, FilePlus, Save, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LogoutConfirm } from "./LogoutConfirm";
//import { SidebarProvider } from "@/context/SideBarContext";
import { useSidebar } from "@/context/SideBarContext";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [logoutModal, setLogoutModal] = useState(false);
  const [authStatus, setAuthStatus] = useState(isAuthenticated);
  //const [collapsed, setCollapsed] = useState(true);
  const { collapsed, toggleCollapsed } = useSidebar();

  useEffect(() => {
    setAuthStatus(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogoutModal = () => setLogoutModal(true);
  const handleLogout = async () => {
    await logout();
    setLogoutModal(false);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-full ${collapsed ? "w-20" : "w-64"} bg-background border-r z-50 p-4 flex flex-col gap-6 shadow-lg transition-all duration-300`}>
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

        <div className="flex flex-col gap-4 items-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full justify-start border border-zinc-300 dark:border-zinc-600">
              {collapsed ? <ChartLine className="h-5 w-5" /> : "Dashboard"}
            </Button>
          </Link>

          <Link to="/job-application-tracker" className="w-full">
            <Button variant="ghost" className="w-full justify-start border border-zinc-300 dark:border-zinc-600">
              {collapsed ? <ChartBarBig className="h-5 w-5" /> : "Job Application Tracker"}
            </Button>
          </Link>
          <Link to="/contacts-tracker" className="w-full">
            <Button variant="ghost" className="w-full justify-start border border-zinc-300 dark:border-zinc-600">
              {collapsed ? <CircleUserRound className="h-5 w-5" /> : "Contacts"}
            </Button>
          </Link>
          <Link to="/generate" className="w-full">
            <Button variant="ghost" className="w-full justify-start border border-zinc-300 dark:border-zinc-600">
              {collapsed ? <FilePlus className="h-5 w-5" /> : "Cover Letter Generator"}
            </Button>
          </Link>

          <Link to="/saved" className="w-full">
            <Button variant="ghost" className="w-full justify-start border border-zinc-300 dark:border-zinc-600">
              {collapsed ? <Save className="h-5 w-5" /> : "Saved Cover Letters"}
            </Button>
          </Link>

          {!isLoading && (
            authStatus ? (
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

          <Button variant="outline" size="icon" onClick={toggleCollapsed} className="mt-auto">
            {collapsed ? ">" : "<"}
          </Button>


        </div>
      </div>

      <LogoutConfirm open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
};

export default Navbar;

