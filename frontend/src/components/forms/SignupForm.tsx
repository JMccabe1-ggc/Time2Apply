import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignUpFormProps = {
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
};

const SignUpForm = ({ onSubmit, loading }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const checkPassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
};
const rules = checkPassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await onSubmit({ firstName, lastName, email, password });
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700 shadow-xl">
      <CardContent className="p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="text-slate-200">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName" className="text-slate-200">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
            <ul className="text-sm mt-2 space-y-1">
  <li className={rules.length ? "text-green-500" : "text-red-500"}>
    {rules.length ? "✓" : "✗"} At least 8 characters
  </li>

  <li className={rules.uppercase ? "text-green-500" : "text-red-500"}>
    {rules.uppercase ? "✓" : "✗"} One uppercase letter
  </li>

  <li className={rules.lowercase ? "text-green-500" : "text-red-500"}>
    {rules.lowercase ? "✓" : "✗"} One lowercase letter
  </li>

  <li className={rules.number ? "text-green-500" : "text-red-500"}>
    {rules.number ? "✓" : "✗"} One number
  </li>

  <li className={rules.special ? "text-green-500" : "text-red-500"}>
    {rules.special ? "✓" : "✗"} One special character
  </li>
</ul>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-slate-200">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;