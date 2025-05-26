import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [role, setRole] = useState('patient');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          role: role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store token and username in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin({ ...credentials, role: data.user.role });
        navigate(data.user.role === 'doctor' ? '/doctor' : '/patient');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <img src={embryoLogo} alt="EmbryoAI Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-2">EmbryoAI</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              required
            />
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
                  onChange={(e) => setRole(e.target.value)}
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
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2 text-gray-800">Doctor</span>
              </label>
            </div>
          </div>

          <div>
          <button
            type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
              Sign in
          </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-rose-600 hover:text-rose-500">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/signup" className="font-medium text-rose-600 hover:text-rose-500">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
