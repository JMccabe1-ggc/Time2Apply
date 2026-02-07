import { useState } from "react";
import Header from "./Header";

const Profile = () => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setPhotoUrl(null);
            return;
        }

        const nextUrl = URL.createObjectURL(file);
        setPhotoUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return nextUrl;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile</h1>
                    <p className="text-slate-300">
                        Keep your profile up to date so your applications look polished.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-36 h-36 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-500 text-sm">No photo</span>
                                )}
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor="profilePhoto"
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Upload Photo
                                </label>
                                <input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                JPG or PNG, up to 5MB.
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <form className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-200 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Jordan Lee"
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
                                        Current Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        placeholder="Frontend Engineer"
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-slate-200 mb-2">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="Austin, TX"
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-200 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    placeholder="Share a short summary of your experience and goals."
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;