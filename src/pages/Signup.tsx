import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import { authAPI } from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (error) setError('');
    if (success) setSuccess('');
  };

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.password === formData.confirmPassword &&
    formData.agreedToTerms;

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Account created! Please check your email to verify your account.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.error || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.getGoogleAuthUrl();
      window.location.href = response.url;
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError('Failed to initiate Google signup. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center">
            <img
              src="/assets/craft_logo.png"
              alt="Logo"
              className="w-16 h-16 rounded-2xl object-contain shadow-sm"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-100 border border-neutral-100 sm:rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleEmailSignup}>
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
                  {success}
                </div>
              )}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-xl border px-4 py-3 placeholder-neutral-400 shadow-sm focus:outline-none sm:text-sm transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-brand-500 focus:ring-brand-500'
                      }`}
                    placeholder="••••••••"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-neutral-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <Button
                  fullWidth
                  size="lg"
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`${isFormValid && !loading
                    ? 'bg-[#4338CA] hover:bg-[#4338CA] shadow-lg shadow-[#4338CA]/20'
                    : 'bg-brand-700 cursor-not-allowed'
                    }`}
                >
                  {loading ? 'Wait a moment...' : 'Create account'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-neutral-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="group inline-flex w-full justify-center rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5 transition-colors duration-300" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="fill-neutral-400 group-hover:fill-[#4285F4] transition-colors"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="fill-neutral-400 group-hover:fill-[#34A853] transition-colors"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      className="fill-neutral-400 group-hover:fill-[#FBBC05] transition-colors"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="fill-neutral-400 group-hover:fill-[#EA4335] transition-colors"
                    />
                  </svg>
                </button>
                <button className="group inline-flex w-full justify-center rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50 transition-all duration-300">
                  <svg className="h-5 w-5 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      className="fill-neutral-400 group-hover:fill-[#181717] transition-colors"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default Signup;
