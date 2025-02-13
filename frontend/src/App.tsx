import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/SignUp'
import { CoverLetterGenerator } from './components/CoverLetterGenerator'
import ForgotPasswordComponent from './components/ForgotPasswordComponent'
import Navbar from './components/Navbar'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (

    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Navbar />
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
              <div className=" min-h-screen  flex items-center justify-center " >
                <SignUpForm /> </div>} />

          <Route path="/cover-letter-generator" element={
            <div className="">
              <CoverLetterGenerator />
            </div>
          } />
        </Routes>
      </Router >
    </ThemeProvider>
  );
}

export default App
