import './App.css'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/*">
          <h2 className="text-2xl font-bold text-white">Time2Apply</h2>
          </Link>
          <div className="flex gap-4">
            <Link to="/login"
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link to="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Speed up the application process with <span className="text-blue-500">Time2Apply</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Find better jobs faster — all in one place
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">Track All Applications</h3>
            <p className="text-slate-300">Keep a centralized record of every job application you submit with key details.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-white mb-2">Reduce wasted time</h3>
            <p className="text-slate-300">Reduce wasted time by centralizing job listings and user filters to evaluate opportunities more efficiently.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Sort by Status</h3>
            <p className="text-slate-300">Allows users to filter by job application methods, such as easy apply, questionnaire, or company site submissions.</p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Resume upload</h3>
            <p className="text-slate-300">Allows users to upload resumes which are parsed to automatically match with relevant job opportunities.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
