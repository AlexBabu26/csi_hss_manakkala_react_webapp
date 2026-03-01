"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simulate API logic - to be replaced with actual backend call
    // const res = await fetch('/api/auth/login', { ... })
    setTimeout(() => {
        if (email === 'admin@csihssmanakala.edu' && password === 'admin123') {
            // Store token 
            localStorage.setItem('auth_token', 'mock_jwt_token_for_now');
            router.push('/admin');
        } else {
            setError('Invalid email or password.');
            setLoading(false);
        }
    }, 1000);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 shadow-xl rounded-lg border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-6">Admin Login</h2>
        
        {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" aria-live="assertive">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
            <input type="email" name="email" id="email" required className={inputClasses} autoComplete="email" placeholder="admin@csihssmanakala.edu" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <input type="password" name="password" id="password" required className={inputClasses} autoComplete="current-password" />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
