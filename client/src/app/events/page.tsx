import type { Metadata } from "next";
import { buildApiUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Upcoming Events | CSI HSS For The Partially Hearing",
  description:
    "Stay updated with the latest happenings, workshops, and celebrations at C.S.I. Higher Secondary School.",
};

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(buildApiUrl("/api/events"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Events() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-hc-text mb-4">
          Upcoming Events
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-12">
          Stay updated with the latest happenings, workshops, and celebrations
          at C.S.I. Higher Secondary School For The Partially Hearing.
        </p>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col"
              >
                <div className="bg-zinc-200 dark:bg-zinc-700 h-48 w-full flex items-center justify-center">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Event Image
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-sm font-semibold text-primary-600 dark:text-hc-interactive mb-2">
                    {formatDate(event.date)}
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    {event.title}
                  </h2>
                  {event.description && (
                    <p className="text-zinc-700 dark:text-zinc-300 mb-4 flex-grow">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
