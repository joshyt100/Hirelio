import React, { useState, ChangeEvent, FormEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ForgotPasswordComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Simple form validation
    if (!email) {
      setError("Please enter a valid email address")
      return
    }

    // Simulate success/failure (this is where you'd normally make an API request)
    setMessage("If an account with that email exists, we have sent a password reset link.")
    setError("")
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-transparent">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>

        {message && <p className="text-center text-green-500">{message}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex justify-center">
          <a
            href="/login"  // You can use regular anchor tags for navigation
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordComponent

