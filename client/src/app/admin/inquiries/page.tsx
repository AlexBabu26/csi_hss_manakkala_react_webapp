"use client";

import { useState, useEffect } from 'react';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export default function ManageInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        setInquiries([
            { id: '1', name: 'John Doe', email: 'john@example.com', message: 'I have a question about admissions.', status: 'unread', created_at: new Date().toISOString() }
        ]);
        setLoading(false);
    }, []);

    if (loading) {
        return <div aria-live="polite">Loading…</div>;
    }

    return (
        <div className="animate-fade-in max-w-5xl">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Inquiries</h1>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {inquiries.map((inq) => (
                        <li key={inq.id} className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        {inq.name}
                                        {inq.status === 'unread' && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>}
                                    </h2>
                                    <a href={`mailto:${inq.email}`} className="text-sm text-primary-600 hover:underline">{inq.email}</a>
                                </div>
                                <span className="text-sm text-zinc-500">{new Date(inq.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 mt-2 bg-zinc-50 dark:bg-zinc-900 p-3 rounded">{inq.message}</p>
                            <div className="mt-4 flex gap-3">
                                <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-300 dark:border-zinc-600 px-3 py-1 rounded">Mark as Read</button>
                            </div>
                        </li>
                    ))}
                    {inquiries.length === 0 && (
                        <li className="p-6 text-center text-zinc-500">No inquiries found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
