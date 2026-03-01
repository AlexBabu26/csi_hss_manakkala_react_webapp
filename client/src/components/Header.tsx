import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-primary-700 dark:bg-hc-bg dark:border-b-2 dark:border-hc-accent text-white dark:text-hc-text shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white dark:focus-visible:ring-hc-accent rounded-md">
                            <div className="font-bold leading-tight">
                                <span className="text-xl">CSI HSS Partially Hearing, Manakala</span>
                            </div>
                        </Link>
                    </div>
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Home</Link>
                            <Link href="/about" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">About</Link>
                            <Link href="/programs" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Programs</Link>
                            <Link href="/events" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Events</Link>
                            <Link href="/gallery" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Gallery</Link>
                            <Link href="/admissions" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Admissions</Link>
                            <Link href="/contact" className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Contact</Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
