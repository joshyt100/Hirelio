import React from "react";
import { LoginForm } from "./components/login/login-form";
import { SignUpForm } from "./components/sign-up/SignUp";
import { CoverLetterGenerator } from "./components/cover-letter-generator/CoverLetterGenerator";
import { SavedCoverLetters } from "./components/saved-cover-letters/SavedCoverLetters";
import ForgotPasswordComponent from "./components/forgot-password/ForgotPasswordComponent";
import { AppSidebar } from "./components/sidebar/Sidebar";
import LandingPage from "./components/landing-page/LandingPage";
import { ThemeProvider } from "./components/theme-provider/theme-provider";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import JobApplicationsPage from "./components/job-applications/JobApplicationsPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ContactLayout from "./components/contact/ContactLayout";
import { SidebarProvider } from "./context/SideBarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import ResumeLayout from "./components/resume/ResumeLayout";
import ProfileLayout from "./components/ProfileLayout";




const queryClient = new QueryClient();





const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbar: Array<string> = ["/login", "/sign-up", "/forgot-password", "/"];

  return (
    <>
      {!hideNavbar.includes(location.pathname) && <AppSidebar />}
      {children}
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/login"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <LoginForm />
                      </div>
                    }
                  />
                  <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
                  <Route path="/saved" element={<SavedCoverLetters />} />
                  <Route
                    path="/sign-up"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <SignUpForm />
                      </div>
                    }
                  />
                  <Route
                    path="/generate"
                    element={
                      <div>
                        <CoverLetterGenerator />
                      </div>
                    }
                  />
                  <Route path="/job-application-tracker" element={<JobApplicationsPage />} />
                  <Route path="/dashboard" element={<DashboardLayout />} />
                  <Route path="/contacts-tracker" element={<ContactLayout />} />
                  <Route path="/profile" element={<ProfileLayout />} />
                </Routes>
              </Layout>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;

