
import React from 'react';

const SkipNavigation = () => {
    return (
        <a 
            href="#main-content" 
            className="absolute z-50 top-0 left-0 m-3 px-4 py-3 bg-primary-700 text-white rounded-md transform -translate-y-20 focus:translate-y-0 transition-transform duration-300 sr-only focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:ring-white dark:bg-hc-interactive dark:text-hc-bg dark:focus:ring-hc-bg"
        >
            Skip to main content
        </a>
    );
};

export default SkipNavigation;
