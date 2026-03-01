import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-zinc-100 dark:bg-hc-bg dark:border-t-2 dark:border-hc-accent text-zinc-800 dark:text-hc-text py-8 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">CSI HSS For The Partially Hearing</h3>
                        <p className="text-sm">Manakala, Adoor, Pathanamthitta District, Kerala</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">Home</Link></li>
                            <li><Link href="/about" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">About Us</Link></li>
                            <li><Link href="/contact" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <address className="not-italic text-sm space-y-2">
                            <p>Phone: +91 12345 67890</p>
                            <p>Email: info@csihssmanakala.edu</p>
                        </address>
                    </div>
                </div>
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-700 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} CSI HSS Manakala. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
