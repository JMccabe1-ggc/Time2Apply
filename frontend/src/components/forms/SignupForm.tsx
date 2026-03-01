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
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
const hasPasswordInput = password.length > 0;
const showPasswordRules = isPasswordFocused || hasPasswordInput;

const getRuleTextClass = (isMet: boolean) => {
  if (!hasPasswordInput) {
    return "text-slate-400";
  }

  return isMet ? "text-emerald-400" : "text-slate-500";
};

const getRuleBadgeClass = (isMet: boolean) => {
  if (!hasPasswordInput) {
    return "border-slate-600 bg-slate-700/60 text-slate-300";
  }

  return isMet
    ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-300"
    : "border-slate-600 bg-slate-700/60 text-slate-300";
};

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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
            {showPasswordRules && (
              <ul className="mt-3 grid grid-cols-1 gap-2 rounded-md border border-slate-700/80 bg-slate-900/60 p-3 text-sm sm:grid-cols-2">
                <li className={`flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-800/40 px-2 py-1.5 ${getRuleTextClass(rules.length)}`}>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${getRuleBadgeClass(rules.length)}`}
                  >
                    {rules.length ? "✓" : "•"}
                  </span>
                  At least 8 characters
                </li>

                <li className={`flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-800/40 px-2 py-1.5 ${getRuleTextClass(rules.uppercase)}`}>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${getRuleBadgeClass(rules.uppercase)}`}
                  >
                    {rules.uppercase ? "✓" : "•"}
                  </span>
                  One uppercase letter
                </li>

                <li className={`flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-800/40 px-2 py-1.5 ${getRuleTextClass(rules.lowercase)}`}>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${getRuleBadgeClass(rules.lowercase)}`}
                  >
                    {rules.lowercase ? "✓" : "•"}
                  </span>
                  One lowercase letter
                </li>

                <li className={`flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-800/40 px-2 py-1.5 ${getRuleTextClass(rules.number)}`}>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${getRuleBadgeClass(rules.number)}`}
                  >
                    {rules.number ? "✓" : "•"}
                  </span>
                  One number
                </li>

                <li className={`flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-800/40 px-2 py-1.5 sm:col-span-2 ${getRuleTextClass(rules.special)}`}>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${getRuleBadgeClass(rules.special)}`}
                  >
                    {rules.special ? "✓" : "•"}
                  </span>
                  One special character
                </li>
              </ul>
            )}
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