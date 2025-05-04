import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up data:', formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pr-8">
        <div className="w-full max-w-md">
          <svg viewBox="0 0 400 400" className="w-full h-auto">
            <rect width="400" height="400" fill="#f3f4f6" rx="20"/>
            {/* Desk */}
            <rect x="50" y="250" width="300" height="10" fill="#94a3b8"/>
            <rect x="70" y="260" width="10" height="100" fill="#94a3b8"/>
            <rect x="320" y="260" width="10" height="100" fill="#94a3b8"/>
            
            {/* Monitor */}
            <rect x="100" y="100" width="200" height="140" fill="#ffffff" stroke="#475569" strokeWidth="4"/>
            <rect x="170" y="240" width="60" height="20" fill="#475569"/>
            <rect x="150" y="260" width="100" height="5" fill="#475569"/>
            
            {/* Screen Content - Embryo */}
            <circle cx="200" cy="170" r="40" fill="#fee2e2"/>
            <circle cx="200" cy="170" r="30" fill="#fecaca"/>
            <circle cx="200" cy="170" r="20" fill="#ef4444"/>
            
            {/* Person */}
            <circle cx="160" cy="280" r="15" fill="#1f2937"/> {/* Head */}
            <rect x="155" y="295" width="10" height="30" fill="#1f2937"/> {/* Body */}
            <rect x="145" y="310" width="30" height="10" fill="#1f2937"/> {/* Arms */}
            <rect x="155" y="325" width="10" height="20" fill="#1f2937"/> {/* Legs */}
            
            {/* Chair */}
            <rect x="140" y="320" width="40" height="5" fill="#64748b"/>
            <rect x="155" y="325" width="10" height="30" fill="#64748b"/>
          </svg>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/2 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
          <p className="text-gray-600 mt-2">Sign up to access EmbryoAI services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <div className="mt-1 relative">
              <input
                type="text"
                placeholder="First Last"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative">
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Set your password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree with <a href="#" className="text-red-600 hover:text-red-500">Terms</a> and <a href="#" className="text-red-600 hover:text-red-500">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Join now
          </button>

          <p className="text-center text-sm text-gray-600">
            Already a member? <Link to="/login" className="text-red-600 hover:text-red-500">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
