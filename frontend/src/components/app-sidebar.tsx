import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Briefcase,
  ChartBarBig,
  ChartLine,
  CircleUserRound,
  FilePlus,
  LogOut,
  Save,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogoutConfirm } from "./navbar/LogoutConfirm";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [logoutModal, setLogoutModal] = useState(false);
  const [authStatus, setAuthStatus] = useState(isAuthenticated);

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
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/generate" className="flex items-center gap-2 font-bold text-lg">
                  <Briefcase className="h-5 w-5" />
                  <span>HireMind</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/dashboard">
                      <ChartLine className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/job-application-tracker">
                      <ChartBarBig className="h-5 w-5" />
                      <span>Job Application Tracker</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/contacts-tracker">
                      <CircleUserRound className="h-5 w-5" />
                      <span>Contacts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/generate">
                      <FilePlus className="h-5 w-5" />
                      <span>Cover Letter Generator</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/saved">
                      <Save className="h-5 w-5" />
                      <span>Saved Cover Letters</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Theme</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span>Toggle Theme</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {authStatus ? (
                <SidebarMenuButton onClick={handleLogoutModal}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <Link to="/login">
                    <LogOut className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <LogoutConfirm open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}

