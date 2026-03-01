"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/login');
    };

    if (!authorized) {
        return <div className="p-8 text-center" aria-live="polite">Loading…</div>;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Manage Home', path: '/admin/home' },
        { name: 'Manage Programs', path: '/admin/programs' },
        { name: 'Manage Admissions', path: '/admin/admissions' },
        { name: 'Manage Events', path: '/admin/events' },
        { name: 'Inquiries', path: '/admin/inquiries' },
    ];

    return (
        <div className="flex min-h-[calc(100vh-200px)]">
            <aside className="w-64 bg-zinc-800 text-white flex flex-col">
                <div className="p-4 border-b border-zinc-700">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            href={item.path}
                            className={`block px-4 py-2 rounded-md transition-colors ${pathname === item.path ? 'bg-primary-600 text-white' : 'hover:bg-zinc-700 text-zinc-300'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-zinc-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-8">
                {children}
            </main>
        </div>
    );
}
