import { LoginForm } from './components/login-form'
import "./App.css"
import { ThemeProvider } from './components/theme-provider'

function App() {


  return (
    <>
      <div className=" min-h-screen  flex items-center justify-center bg-gradient-to-tl from-zinc-900 to-black">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <LoginForm />
        </ThemeProvider>
      </div>


    </>
  )
}

export default App
