import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    // State for desktop sidebar (expanded/collapsed)
    const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
    // State for mobile sidebar (open/closed)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const navLinkClasses = "flex items-center px-4 py-3 text-zinc-100 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400";
    const activeLinkClasses = "bg-primary-800";

    const sidebarLinks = [
        { to: '/admin', text: 'Overview', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /> },
        { to: 'home', text: 'Home Page', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21H8.25V3.545M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" /> },
        { to: 'about', text: 'About Page', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /> },
        { to: 'programs', text: 'Programs Page', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> },
        { to: 'admissions', text: 'Admissions Page', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /> },
        { to: 'contact', text: 'Contact Page', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /> },
        { to: 'events', text: 'Events', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /> },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 h-16 border-b border-primary-800">
                <Link to="/admin" className={`font-bold text-xl whitespace-nowrap overflow-hidden ${!isDesktopSidebarExpanded && 'md:hidden'}`}>Admin Panel</Link>
                {/* Desktop Toggle */}
                <button onClick={() => setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded)} className="p-2 rounded-md hover:bg-primary-600 hidden md:block">
                    <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></Icon>
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {sidebarLinks.map(link => (
                    <NavLink key={link.to} to={link.to} end={link.to === '/admin'} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <Icon className="w-6 h-6 flex-shrink-0">{link.icon}</Icon>
                        <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${!isDesktopSidebarExpanded && 'md:opacity-0 md:hidden'}`}>{link.text}</span>
                    </NavLink>
                ))}
            </nav>
             <div className="p-4 border-t border-primary-800">
                <Link to="/" className={navLinkClasses}>
                    <Icon className="w-6 h-6 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </Icon>
                    <span className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${!isDesktopSidebarExpanded && 'md:opacity-0 md:hidden'}`}>View Site</span>
                </Link>
            </div>
        </div>
    );
    
    return (
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
             {/* Backdrop for mobile */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
            
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-primary-700 text-white transform transition-transform duration-300 ease-in-out z-30 
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
                ${isDesktopSidebarExpanded ? 'w-64' : 'md:w-20'}`}>
                <SidebarContent />
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                 <header className="md:hidden bg-white dark:bg-zinc-800 shadow-sm flex justify-between items-center p-4 h-16">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-md text-zinc-800 dark:text-zinc-100" aria-label="Open sidebar">
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></Icon>
                    </button>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <div className="w-8"></div>
                 </header>

                {/* Desktop Header */}
                 <header className="hidden md:flex bg-white dark:bg-zinc-800 shadow-sm justify-end items-center p-4 h-16">
                     <div className="flex items-center space-x-4">
                        <span className="text-zinc-600 dark:text-zinc-300">Welcome, {user?.email}</span>
                        <button onClick={logout} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Logout</button>
                     </div>
                 </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-100 dark:bg-zinc-900 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;