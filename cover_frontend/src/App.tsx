import { LoginForm } from './components/login-form'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <Routes>
        <Route
          path="/" element={
            <>
              <div className=" min-h-screen  flex items-center justify-center bg-gradient-to-tl from-zinc-900 to-black">
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <LoginForm className=" shadow-zinc-700 shadow-md rounded-lg " />
                </ThemeProvider>
              </div>
            </>}
        />
      </Routes>
    </Router>
  );
}

export default App
