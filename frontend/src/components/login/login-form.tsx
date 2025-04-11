import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/api/auth"
import CSRFToken from "../csrf-token/CSRFToken"
import { useAuth } from "@/context/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginUser({ email, password })

      // Use the login function from AuthContext to update auth state
      login(response.user || { email })

      setMessage("Logged in Successfully")
      navigate("/generate")
    }
    catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Error occurred during the login process")
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <CSRFToken />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => window.location.href = "http://127.0.0.1:8000/google/login/google-oauth2/"}
                disabled={isLoading}
              >
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a onClick={() => navigate("/sign-up")} className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
