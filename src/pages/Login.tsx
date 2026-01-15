import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.getGoogleAuthUrl();
      window.location.href = response.url;
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Failed to initiate Google login. Please try again.');
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
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-100 border border-neutral-100 sm:rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-neutral-200 px-4 py-3 placeholder-neutral-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  fullWidth
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-neutral-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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

export default Login;
