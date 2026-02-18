import { Link } from "react-router-dom";

const Newpassword = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-32 left-0 w-96 h-96 bg-slate-500/20 blur-3xl rounded-full" />

            <div className="max-w-md mx-auto px-4 py-16 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Set New Password
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg">
                        Check your email for the security code and enter your new password below.
                    </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
                    <form className="space-y-5">
                        <div>
                            <label htmlFor="securitycode" className="block text-sm font-medium text-slate-200 mb-2">
                                Security Code
                            </label>
                            <input
                                type="text"
                                id="securitycode"
                                name="securitycode"
                                placeholder="Enter security code sent to your email"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-slate-200 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                name="new-password"
                                placeholder="Enter new password"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-200 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="Confirm new password"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Update Password
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-300">
                        Back to{" "}
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

export default Newpassword;