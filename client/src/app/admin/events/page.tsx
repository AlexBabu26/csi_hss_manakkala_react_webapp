"use client";

import { useState, useEffect } from 'react';

// Define event interface to match the API
interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
}

export default function ManageEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch events from API
        // For now, mock it
        setEvents([
            { id: '1', title: 'Annual Sports Meet', date: '2026-03-15T00:00:00.000Z', description: 'Join us for our annual sports day.' }
        ]);
        setLoading(false);
    }, []);

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive text-zinc-900 dark:text-white";

    if (loading) {
        return <div aria-live="polite">Loading…</div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Manage Events</h1>
                <button className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg px-4 py-2 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500">
                    Add New Event
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {events.map((event) => (
                        <li key={event.id} className="p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{event.title}</h2>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <div className="space-x-2">
                                <button className="text-primary-600 hover:text-primary-800 font-medium">Edit</button>
                                <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
