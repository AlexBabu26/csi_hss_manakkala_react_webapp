"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        // Use relative path which will be proxied by Next.js or direct to backend depending on env
        const res = await fetch('http://localhost:5000/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Failed to submit');
        
        setStatus('success');
        (e.target as HTMLFormElement).reset();
    } catch (err) {
        console.error(err);
        setStatus('error');
    }
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive text-zinc-900 dark:text-white";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-hc-text mb-8 text-center">Contact Us</h1>
        
        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2 border border-zinc-200 dark:border-zinc-700">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-6">Send a Message</h2>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md" aria-live="polite">
                Thank you for your message. We will get back to you shortly.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-md" aria-live="assertive">
                An error occurred. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                <input type="text" name="name" id="name" required className={inputClasses} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                <input type="email" name="email" id="email" required className={inputClasses} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                <textarea id="message" name="message" rows={4} required className={inputClasses}></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
          
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-6">Contact Information</h2>
            <address className="not-italic space-y-4">
              <p>
                <strong className="block text-zinc-900 dark:text-white">Address:</strong>
                CSI Higher Secondary School<br/>
                For The Partially Hearing<br/>
                Manakala, Adoor<br/>
                Pathanamthitta, Kerala
              </p>
              <p>
                <strong className="block text-zinc-900 dark:text-white">Phone:</strong>
                <a href="tel:+911234567890" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">+91 12345 67890</a>
              </p>
              <p>
                <strong className="block text-zinc-900 dark:text-white">Email:</strong>
                <a href="mailto:info@csihssmanakala.edu" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">info@csihssmanakala.edu</a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
