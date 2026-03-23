"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { buildApiUrl } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch(buildApiUrl("/api/media/settings"))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.site_logo) setSiteLogo(data.site_logo);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const linkClasses = (href: string) =>
    `px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors ${
      pathname === href
        ? "bg-primary-800 dark:bg-zinc-700 text-white"
        : "hover:bg-primary-600 dark:hover:bg-zinc-700"
    }`;

  return (
    <header className="bg-primary-700 dark:bg-hc-bg dark:border-b-2 dark:border-hc-accent text-white dark:text-hc-text shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white dark:focus-visible:ring-hc-accent rounded-md"
            >
              {siteLogo && (
                <span className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white border border-white/20 shadow-sm">
                  <Image
                    src={siteLogo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized
                  />
                </span>
              )}
              <span className="font-bold leading-tight text-xl">
                CSI HSS Partially Hearing, Manakala
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClasses(href)}>
                  {label}
                </Link>
              ))}
              <Link
                href="/login"
                className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white/15 hover:bg-white/25 border border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Staff Login
              </Link>
            </div>
          </nav>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-600 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" className="md:hidden bg-primary-800 dark:bg-zinc-900 border-t border-primary-600 dark:border-zinc-700" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors ${
                  pathname === href
                    ? "bg-primary-600 dark:bg-zinc-700 text-white"
                    : "text-primary-100 hover:bg-primary-600 dark:hover:bg-zinc-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-primary-600/50 dark:border-zinc-700 mt-2 pt-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:bg-primary-600 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Staff Login
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
