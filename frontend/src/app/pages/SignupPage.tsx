import { useState } from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../../components/forms/SignupForm.tsx";

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload: SignupPayload) => {
    setResponseMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Signup failed.");
      }

      setResponseMessage(data?.message || "Account created ✅");
    } catch (error) {
      setResponseMessage(
        error instanceof Error
          ? error.message
          : "Backend not reachable. Make sure FastAPI is running on port 8001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 bg-slate-500/20 blur-3xl rounded-full" />

      <div className="max-w-md mx-auto px-4 py-2 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Start tracking your job applications today.
          </p>
        </div>

        <SignUpForm onSubmit={handleSubmit} loading={loading} />

        {responseMessage && (
          <p className="mt-4 text-sm text-slate-200">{responseMessage}</p>
        )}

        <div className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Log In
          </Link>
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

export default SignupPage;