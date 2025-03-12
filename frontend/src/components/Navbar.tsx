import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { FileText, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LogoutConfirm } from "./LogoutConfirm";

const Navbar: React.FC = () => {
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
      <div className="border-b sticky top-0 z-50 bg-background backdrop-blur-sm bg-opacity-80">
        <nav className="p-4 flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <Link to="/generate" className="text-xl font-bold">
              CoverAI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/generate">
              <Button variant="ghost" className="border dark:border-gray-600">Generate Cover Letter</Button>
            </Link>
            <Link to="/saved">
              <Button variant="ghost" className="border dark:border-gray-600">Saved Cover Letters</Button>
            </Link>

            {isLoading ? null : authStatus ? (
              <Button onClick={handleLogoutModal} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>

      <LogoutConfirm open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
};

export default Navbar;

