import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Upcoming Events | CSI HSS For The Partially Hearing',
  description: 'Stay updated with the latest happenings, workshops, and celebrations at C.S.I. Higher Secondary School.',
};

export default function Events() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-hc-text mb-8">Upcoming Events</h1>
        
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-12">
          Stay updated with the latest happenings, workshops, and celebrations at C.S.I. Higher Secondary School For The Partially Hearing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Static placeholder for events - will be replaced with dynamic data fetching */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col">
            <div className="bg-zinc-200 dark:bg-zinc-700 h-48 w-full flex items-center justify-center">
                <span className="text-zinc-500 dark:text-zinc-400">Event Image Placeholder</span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="text-sm font-semibold text-primary-600 dark:text-hc-interactive mb-2">March 15, 2026</div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Annual Sports Meet</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4 flex-grow">
                Join us for our annual sports day celebrating the athletic achievements of our students with various inclusive games and activities.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col">
            <div className="bg-zinc-200 dark:bg-zinc-700 h-48 w-full flex items-center justify-center">
                <span className="text-zinc-500 dark:text-zinc-400">Event Image Placeholder</span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="text-sm font-semibold text-primary-600 dark:text-hc-interactive mb-2">April 02, 2026</div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Autism & Hearing Awareness Day</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4 flex-grow">
                A special workshop and seminar open to parents and the community to raise awareness and share best practices in special education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
