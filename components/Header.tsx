
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const navLinkClasses = "px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 dark:focus:ring-offset-hc-bg focus:ring-white dark:focus:ring-hc-accent";
    const activeLinkClasses = "bg-primary-800 dark:bg-hc-interactive dark:text-hc-bg";
    const inactiveLinkClasses = "hover:bg-primary-600 dark:hover:bg-zinc-700";
    
    const mobileNavLinkClasses = "block px-3 py-2 rounded-md text-base font-medium text-center";

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
    };

    return (
        <header className="bg-primary-700 dark:bg-hc-bg dark:border-b-2 dark:border-hc-accent text-white dark:text-hc-text shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 dark:focus:ring-offset-hc-bg focus:ring-white dark:focus:ring-hc-accent rounded-md">
                            <img src="data:image/png;base64,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" alt="C.S.I. HSS Manakala Logo" className="h-12 w-12" />
                            <span className="text-xl font-bold">C.S.I. HSS Manakala</span>
                        </Link>
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Home</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>About</NavLink>
                            <NavLink to="/programs" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Programs</NavLink>
                            <NavLink to="/admissions" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Admissions</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Contact</NavLink>
                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Admin Panel</NavLink>
                                    <button onClick={logout} className={`${navLinkClasses} ${inactiveLinkClasses}`}>Logout</button>
                                </>
                            ) : (
                                <NavLink to="/login" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Login</NavLink>
                            )}
                        </div>
                    </nav>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <Icon className="block h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
                            ) : (
                                <Icon className="block h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></Icon>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                 <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-700 dark:bg-hc-bg">
                        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Home</NavLink>
                        <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>About</NavLink>
                        <NavLink to="/programs" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Programs</NavLink>
                        <NavLink to="/admissions" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Admissions</NavLink>
                        <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Contact</NavLink>
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Admin Panel</NavLink>
                                <button onClick={handleLogout} className={`${mobileNavLinkClasses} w-full ${inactiveLinkClasses}`}>Logout</button>
                            </>
                        ) : (
                            <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Login</NavLink>
                        )}
                    </div>
                 </div>
            )}
        </header>
    );
};

export default Header;
