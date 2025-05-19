import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'patient'  // Varsayılan rol
  });
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (!agreeToTerms) {
      setError('Devam etmek için şartları kabul etmelisiniz');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu');
      }

      if (data.success) {
      navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <img src={embryoLogo} alt="EmbryoAI Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-2">EmbryoAI</h1>
          <p className="text-gray-500">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  checked={formData.role === 'patient'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span className="ml-2 text-gray-800">Patient</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-rose-600 focus:ring-rose-500"
                  name="role"
                  value="doctor"
                  checked={formData.role === 'doctor'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span className="ml-2 text-gray-800">Doctor</span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-rose-600 hover:text-rose-500">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <div>
          <button
            type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
              Register
          </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
                Sign in
              </Link>
          </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
