import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/SignUp'
import ForgotPasswordComponent from './components/ForgotPasswordComponent'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route
            path="/login" element={
              <>
                <div className=" min-h-screen  flex items-center justify-center bg-gradient-to-tl from-zinc-900 to-black">
                  <LoginForm />
                </div>
              </>}
          />

          <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
          <Route path="/sign-up" element=
            {
              <div className=" min-h-screen  flex items-center justify-center bg-gradient-to-tl from-zinc-900 to-black">
                <SignUpForm /> </div>} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App
