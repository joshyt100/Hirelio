import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/SignUp'
import { CoverLetterGenerator } from './components/CoverLetterGenerator'
import ForgotPasswordComponent from './components/ForgotPasswordComponent'
import Navbar from './components/Navbar'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar: Array<string> = ['/login', '/sign-up', '/forgot-password'];

  return (
    <>
      {!hideNavbar.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route
              path="/login"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <LoginForm />
                </div>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
            <Route
              path="/sign-up"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <SignUpForm />
                </div>
              }
            />
            <Route
              path="/"
              element={
                <div>
                  <CoverLetterGenerator />
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
