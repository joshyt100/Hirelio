import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/api/auth";
import CSRFToken from "../csrf-token/CSRFToken";

const ForgotPasswordComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage("A reset password link has been sent to your email.");
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error(err);
      setMessage(null); // Clear any previous success messages
      setError(err.message || "An error occurred during the reset password process.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-transparent">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CSRFToken />
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
              onChange={(e) => setEmail(e.target.value)}
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
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;

