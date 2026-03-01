export default function AdminDashboard() {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold mb-2">Unread Inquiries</h2>
                    <p className="text-3xl font-bold text-primary-600 dark:text-hc-interactive">0</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
                    <p className="text-3xl font-bold text-primary-600 dark:text-hc-interactive">0</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold mb-2">Programs</h2>
                    <p className="text-3xl font-bold text-primary-600 dark:text-hc-interactive">0</p>
                </div>
            </div>
        </div>
    );
}
