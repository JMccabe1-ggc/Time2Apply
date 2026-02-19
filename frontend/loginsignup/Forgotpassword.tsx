import supabase from "@/utils/supabase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const goToNewPassword = () => {
    navigate("/newpassword");
  };

  const [email, setEmail] = useState("");

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/newpassword`,
    });

    // Always show a generic success message (prevents email enumeration)
    if (error) {
      setMsg(
        "If an account exists for that email, you’ll receive a reset link shortly.",
      );
      return;
    }
    setMsg(
      "If an account exists for that email, you’ll receive a reset link shortly.",
    );
  };
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 bg-slate-500/20 blur-3xl rounded-full" />

      <div className="max-w-md mx-auto px-4 py-16 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <form className="space-y-5" onSubmit={sendReset}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Send Reset Link
            </button>
          </form>
          {msg && (
            <p className="mt-4 text-center text-sm text-green-400">{msg}</p>
          )}
          <div className="mt-6 text-center text-sm text-slate-300">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Log In
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
