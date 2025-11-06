
import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const { preferences } = useAccessibility();
    const { login } = useAuth();
    const navigate = useNavigate();
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [error, setError] = useState<string | null>(null);

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive";

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Demo credentials
        if (email === 'admin@csihssmanakala.edu' && password === 'password123') {
            login(email);
            navigate('/admin');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Sign up successful! Please log in with your new account.');
        setActiveTab('login');
        (e.target as HTMLFormElement).reset();
    };
    
    const tabButtonClasses = "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-hc-interactive";
    const activeTabClasses = "border-primary-500 dark:border-hc-interactive text-primary-600 dark:text-hc-interactive";
    const inactiveTabClasses = "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-500";


    return (
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${fadeInClass}`}>
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
                <div className="flex" role="tablist" aria-label="Login and Sign Up">
                    <button
                        onClick={() => { setActiveTab('login'); setError(null); }}
                        role="tab"
                        aria-selected={activeTab === 'login'}
                        aria-controls="login-panel"
                        id="login-tab"
                        className={`${tabButtonClasses} ${activeTab === 'login' ? activeTabClasses : inactiveTabClasses}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setActiveTab('signup'); setError(null); }}
                        role="tab"
                        aria-selected={activeTab === 'signup'}
                        aria-controls="signup-panel"
                        id="signup-tab"
                        className={`${tabButtonClasses} ${activeTab === 'signup' ? activeTabClasses : inactiveTabClasses}`}
                    >
                        Sign Up
                    </button>
                </div>
                <div className="p-8">
                    {activeTab === 'login' && (
                        <div id="login-panel" role="tabpanel" aria-labelledby="login-tab">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-6">Welcome Back!</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Email Address</label>
                                    <input type="email" name="email" id="login-email" required className={inputClasses} autoComplete="email" defaultValue="admin@csihssmanakala.edu" />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Password</label>
                                    <input type="password" name="password" id="login-password" required className={inputClasses} autoComplete="current-password" defaultValue="password123" />
                                </div>
                                <div className="text-right">
                                    <Link to="#" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">Forgot password?</Link>
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-hc-bg">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                     {activeTab === 'signup' && (
                        <div id="signup-panel" role="tabpanel" aria-labelledby="signup-tab">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-6">Create an Account</h2>
                             <form onSubmit={handleSignupSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="signup-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Full Name</label>
                                    <input type="text" name="name" id="signup-name" required className={inputClasses} autoComplete="name" />
                                </div>
                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Email Address</label>
                                    <input type="email" name="email" id="signup-email" required className={inputClasses} autoComplete="email" />
                                </div>
                                <div>
                                    <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Password</label>
                                    <input type="password" name="password" id="signup-password" required className={inputClasses} autoComplete="new-password" />
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-hc-bg">
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
