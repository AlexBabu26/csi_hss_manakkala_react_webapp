"use client";

import { useState } from 'react';

export default function ManageHome() {
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    }

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive text-zinc-900 dark:text-white";

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Manage Home Page</h1>
                {status === 'success' && <span className="text-green-600 font-medium" aria-live="polite">Saved successfully!</span>}
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="heroHeading" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Heading</label>
                            <input type="text" id="heroHeading" defaultValue="Empowering the Partially Hearing" className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="heroSubheading" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Subheading</label>
                            <textarea id="heroSubheading" rows={3} defaultValue="Providing accessible, inclusive, and high-quality education to help every student reach their full potential." className={inputClasses}></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={status === 'saving'}
                        className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg px-6 py-2 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-70"
                    >
                        {status === 'saving' ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
