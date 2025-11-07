
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
                            <img src="https://3dkj7nxtnweewnby.public.blob.vercel-storage.com/CSIlogo.jpg" alt="C.S.I. HSS Manakala Logo" className="h-12 w-12" />
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