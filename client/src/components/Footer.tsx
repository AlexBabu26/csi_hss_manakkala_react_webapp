"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

interface ContactEntry {
  id: number;
  info_type: string;
  label: string;
  value: string;
  is_primary: boolean;
}

const DEFAULT_ADDRESS = "Manakala, Adoor, Pathanamthitta District, Kerala";

export default function Footer() {
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(buildApiUrl("/api/media/contact"));
        if (!res.ok || cancelled) return;
        const contactEntries: ContactEntry[] = await res.json();
        const primaryAddress = contactEntries.find(
          (e) => e.info_type === "address" && e.is_primary
        );
        const primaryPhone = contactEntries.find(
          (e) => e.info_type === "phone" && e.is_primary
        );
        const primaryEmail = contactEntries.find(
          (e) => e.info_type === "email" && e.is_primary
        );
        if (!cancelled) {
          setAddress(primaryAddress?.value ?? DEFAULT_ADDRESS);
          setPhone(primaryPhone?.value ?? null);
          setEmail(primaryEmail?.value ?? null);
        }
      } catch {
        if (!cancelled) {
          setAddress(DEFAULT_ADDRESS);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-zinc-100 dark:bg-hc-bg dark:border-t-2 dark:border-hc-accent text-zinc-800 dark:text-hc-text py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">CSI HSS For The Partially Hearing</h3>
            <p className="text-sm leading-relaxed">{address}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-sm space-y-2">
              {phone && (
                <p>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Phone: {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Email: {email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; {new Date().getFullYear()} CSI HSS Manakala. All rights reserved.</p>
          <Link
            href="/login"
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            aria-label="Staff / Admin Login"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
