import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import Icon from './Icon';

const FloatingActionButtons = () => {
    const { content } = useContent();
    const { contact } = content;
    const [showContactOptions, setShowContactOptions] = useState(false);

    // Extract phone numbers - handles "04734 230461, 9447158704 (Principal)" format
    const phoneNumbers = contact.phone.split(',').map(phone => 
        phone.replace(/[^0-9+]/g, '').trim()
    );

    const handleCallClick = (phoneNumber: string) => {
        // Direct dialer invocation
        window.location.href = `tel:${phoneNumber}`;
        setShowContactOptions(false);
    };

    const handleLocationClick = () => {
        // Redirect to specific Google Maps link
        window.open('https://maps.app.goo.gl/QazQbRYxhpbWWMwT8', '_blank');
    };

    const toggleContactOptions = () => {
        setShowContactOptions(!showContactOptions);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-24 md:left-auto md:right-4 md:w-auto">
            {/* Contact Options Popup */}
            {showContactOptions && (
                <div className="absolute bottom-full left-4 right-4 md:bottom-0 md:right-0 md:left-auto mb-2 bg-white/95 backdrop-blur-md dark:bg-zinc-800/95 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-600 p-4 md:min-w-[280px] animate-fadeIn">
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-3 text-center">Contact Options</h3>
                    <div className="space-y-2">
                        {phoneNumbers.map((phone, index) => (
                            <button
                                key={index}
                                onClick={() => handleCallClick(phone)}
                                className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 rounded-xl transition-all duration-200 group"
                            >
                                <div className="p-2 bg-green-500 rounded-full">
                                    <Icon className="w-4 h-4 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </Icon>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-zinc-900 dark:text-white">{phone}</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                                        {index === 0 ? 'Office' : 'Principal'}
                                    </p>
                                </div>
                            </button>
                        ))}
                        
                        {/* Email Option */}
                        <button
                            onClick={() => window.location.href = `mailto:${contact.email}`}
                            className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 rounded-xl transition-all duration-200"
                        >
                            <div className="p-2 bg-blue-500 rounded-full">
                                <Icon className="w-4 h-4 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 2.25l-8.44 6.32a2.25 2.25 0 01-2.62 0L2.25 9z" />
                                </Icon>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-zinc-900 dark:text-white">Email</p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-300">{contact.email}</p>
                            </div>
                        </button>
                    </div>
                    
                    {/* Close button */}
                    <button
                        onClick={() => setShowContactOptions(false)}
                        className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <Icon className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </Icon>
                    </button>
                </div>
            )}

            {/* Mobile: Bottom tab bar, Desktop: Stacked buttons above accessibility */}
            <div className="bg-white/95 backdrop-blur-md dark:bg-zinc-800/95 border-t border-zinc-200 dark:border-zinc-600 md:border md:rounded-lg md:shadow-2xl p-3 md:p-2">
                
                {/* Button Layout: Horizontal on mobile, vertical stack on desktop */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-2 justify-center md:justify-start">
                    {/* Contact Button */}
                    <button
                        onClick={toggleContactOptions}
                        className="flex-1 md:flex-none h-12 md:w-12 md:h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl md:rounded-full flex items-center justify-center gap-2 md:gap-0 transition-all duration-300 hover:scale-105 md:hover:scale-110 group relative shadow-lg md:shadow-lg"
                        aria-label="Contact Us"
                    >
                        <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </Icon>
                        <span className="text-sm font-medium md:hidden">Contact</span>
                        
                        {/* Desktop Tooltip */}
                        <div className="hidden md:block absolute right-full mr-3 px-3 py-2 bg-zinc-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Contact Us
                        </div>
                    </button>

                    {/* Location Button */}
                    <button
                        onClick={handleLocationClick}
                        className="flex-1 md:flex-none h-12 md:w-12 md:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl md:rounded-full flex items-center justify-center gap-2 md:gap-0 transition-all duration-300 hover:scale-105 md:hover:scale-110 group relative shadow-lg md:shadow-lg"
                        aria-label="View Location"
                    >
                        <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                        </Icon>
                        <span className="text-sm font-medium md:hidden">Location</span>
                        
                        {/* Desktop Tooltip */}
                        <div className="hidden md:block absolute right-full mr-3 px-3 py-2 bg-zinc-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            View Location
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloatingActionButtons;
