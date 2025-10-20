import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useContent } from '../hooks/useContent';

const ContactPage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    const { contact } = content;
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${fadeInClass}`}>
            <div className="max-w-6xl mx-auto">
                 <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-8 text-center">Contact Us</h1>
                 <p className="text-center text-lg max-w-3xl mx-auto mb-12 text-zinc-600 dark:text-zinc-300">
                    We'd love to hear from you! Whether you have a question about admissions, programs, or anything else, our team is ready to answer all your questions.
                 </p>

                 <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden md:grid md:grid-cols-2">
                     <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-primary-700 dark:text-hc-interactive mb-6">Send Us a Message</h2>
                         <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Full Name</label>
                                <input type="text" name="name" id="name" required className={inputClasses} autoComplete="name" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Email Address</label>
                                <input type="email" name="email" id="email" required className={inputClasses} autoComplete="email" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Message</label>
                                <textarea id="message" name="message" rows={5} required className={inputClasses}></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-hc-bg">
                                    Send Message
                                </button>
                            </div>
                         </form>
                     </div>
                     <div className="p-8 md:p-12 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">
                        <h2 className="text-3xl font-bold text-primary-700 dark:text-hc-interactive mb-6">Our Information</h2>
                        <div className="space-y-6 text-lg">
                            <address className="not-italic space-y-4">
                                <p>
                                    <strong className="block">Address:</strong>
                                    {contact.address.split(',').map((line, i) => <span key={i} className="block">{line.trim()}</span>)}
                                </p>
                                <p>
                                    <strong className="block">Phone:</strong>
                                    <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary-500 rounded">{contact.phone}</a>
                                </p>
                                 <p>
                                    <strong className="block">Email:</strong>
                                    <a href={`mailto:${contact.email}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary-500 rounded">{contact.email}</a>
                                </p>
                            </address>
                            <div>
                                <strong className="block">Office Hours:</strong>
                                <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
                            </div>
                            <div>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" aria-label="View location on Google Maps (opens in a new tab)">
                                    <img 
                                        src="https://placehold.co/600x400/e0effe/333333?text=Find+Us+On+The+Map"
                                        alt="A placeholder map showing the location of the Inclusive Learning Hub."
                                        className="w-full h-auto rounded-lg shadow-md mt-4"
                                    />
                                </a>
                            </div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ContactPage;