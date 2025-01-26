import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/SignUp'
import ForgotPasswordComponent from './components/ForgotPasswordComponent'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="bg-zinc-50">
          <Routes>
            <Route
              path="/login" element={
                <>
                  <div className=" min-h-screen  flex items-center justify-center">
                    <LoginForm />
                  </div>
                </>}
            />

            <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
            <Route path="/sign-up" element=
              {
                <div className=" min-h-screen  flex items-center justify-center" >
                  <SignUpForm /> </div>} />

            <Route path="/cover-letter-generator" element={
              <p>cover letter generator page</p>
            } />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App
