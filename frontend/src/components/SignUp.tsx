
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { registerUser } from "@/api/auth"; //import function to register user
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CSRFToken from "./csrftoken";
import { useNavigate } from 'react-router-dom';

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // to submit form <information></information>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = { email, password }

    try {
      const response = await registerUser(data)
      setMessage(response.message)
      navigate("/generate")
    }
    catch (err) {
      console.log(err)
      setError(err.message || "Error occured during registry process")

    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = "http://127.0.0.1:8000/google/login/google-oauth2/"}
              >
                Register with Google
              </Button>

            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account? {"  "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
          {message && <p className="text-center text-green-500">{message}</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
