import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const fakeLogin = () =>{
        if (email==="a@a.com" && password==="admin"){
            navigate("/user");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-32 left-0 w-96 h-96 bg-slate-500/20 blur-3xl rounded-full" />

            <div className="max-w-md mx-auto px-4 py-16 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg">
                        Log in to manage your job applications.
                    </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
                    <form className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Your password"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-300">
                                <input type="checkbox" className="rounded border-slate-600 bg-slate-900" />
                                Remember me
                            </label>
                            <Link to="/forgotpassword" className="text-blue-400 hover:text-blue-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                fakeLogin();
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-300">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                            Sign Up
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

export default Login;