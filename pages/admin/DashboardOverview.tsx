import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';

const StatCard: React.FC<{ title: string; linkTo: string; children: React.ReactNode }> = ({ title, linkTo, children }) => {
    return (
        <Link to={linkTo} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
            <div className="text-primary-600 dark:text-primary-400 mb-4">
                <Icon className="w-12 h-12">{children}</Icon>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Manage Content</p>
        </Link>
    );
};

const DashboardOverview = () => {
    const { user } = useAuth();

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome, {user?.email}!</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Select a section below to start managing your website's content.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Home Page" linkTo="/admin/home">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
                </StatCard>
                 <StatCard title="About Page" linkTo="/admin/about">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </StatCard>
                <StatCard title="Programs Page" linkTo="/admin/programs">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </StatCard>
                 <StatCard title="Admissions Page" linkTo="/admin/admissions">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </StatCard>
                 <StatCard title="Contact Page" linkTo="/admin/contact">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </StatCard>
                <StatCard title="Events" linkTo="/admin/events">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
                </StatCard>
            </div>
        </div>
    );
};

export default DashboardOverview;
