import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.svg';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [role, setRole] = useState('patient'); // Default to patient

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <img src={embryoLogo} alt="EmbryoAI Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-2">EmbryoAI</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
            <div className="mt-1">
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="mt-6 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex items-center space-x-6 bg-gray-50 p-3 rounded-lg">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-rose-600 focus:ring-rose-500"
                  name="role"
                  value="patient"
                  checked={role === 'patient'}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setCredentials(prev => ({
                      ...prev,
                      email: e.target.value === 'doctor' ? 'doctor@example.com' : 'patient@example.com'
                    }));
                  }}
                />
                <span className="ml-2 text-gray-800">Patient</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-rose-600 focus:ring-rose-500"
                  name="role"
                  value="doctor"
                  checked={role === 'doctor'}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setCredentials(prev => ({
                      ...prev,
                      email: e.target.value === 'doctor' ? 'doctor@example.com' : 'patient@example.com'
                    }));
                  }}
                />
                <span className="ml-2 text-gray-800">Doctor</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white py-3 px-4 rounded-lg hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-150 font-medium shadow-md mt-6"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link to="/signup" className="text-rose-600 hover:text-rose-500 font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
