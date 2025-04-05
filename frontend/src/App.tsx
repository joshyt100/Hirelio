import React from "react";
import { LoginForm } from "./components/login-form";
import { SignUpForm } from "./components/SignUp";
import { CoverLetterGenerator } from "./components/CoverLetterGenerator";
import { SavedCoverLetters } from "./components/SavedCoverLetters";
import ForgotPasswordComponent from "./components/ForgotPasswordComponent";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import JobApplicationsPage from "./components/jobapplications/JobApplicationsPage";
import DashboardLayout from "./components/DashboardLayout";
import ContactLayout from "./components/ContactLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbar: Array<string> = ["/login", "/sign-up", "/forgot-password", "/"];

  return (
    <>
      {!hideNavbar.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

