import supabase from "@/utils/supabase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Newpassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // session exists

  useEffect(() => {
    const init = async () => {
      setMsg(null);
      setReady(false);

      // If Supabase returns an error in the hash, show it
      if (window.location.hash.includes("error=")) {
        const params = new URLSearchParams(window.location.hash.replace("#", ""));
        const desc = params.get("error_description")?.replace(/\+/g, " ");
        setMsg(desc || "Invalid or expired reset link.");
        return;
      }

      // Exchange ?code=... for a session (PKCE recovery flow)
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg(error.message);
          return;
        }
        // clean URL (removes code from address bar)
        url.searchParams.delete("code");
        window.history.replaceState({}, "", url.toString());
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMsg("Open the reset link from your email again.");
        return;
      }

      setReady(true);
    };

    void init();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!ready) {
      setMsg("Reset session missing. Open the reset link again.");
      return;
    }
    if (password !== confirmPassword) return setMsg("Passwords do not match.");
    if (password.length < 8) return setMsg("Password must be at least 8 characters.");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return setMsg(error.message);

    setMsg("Password updated! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
        <p className="text-slate-300 mb-6">Choose a strong password for your account.</p>

        {msg && <p className="mb-4 text-sm text-red-400">{msg}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready || loading}
          />
          <input
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!ready || loading}
          />

          <button
            type="submit"
            disabled={!ready || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 font-semibold py-2.5 rounded-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-300">
          Back to <Link className="text-blue-400" to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}