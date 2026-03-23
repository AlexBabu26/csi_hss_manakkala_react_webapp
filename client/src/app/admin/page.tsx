"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Stats {
  unreadInquiries: number;
  upcomingEvents: number;
}

const quickLinks = [
  {
    title: "Media & Images",
    description: "Upload logos, photos, and facility images",
    href: "/admin/media",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    span: "col-span-1 row-span-1 sm:col-span-2",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 6.75h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
      </svg>
    ),
  },
  {
    title: "Manage Home",
    description: "Edit hero heading, subheading and features",
    href: "/admin/home",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "Manage About",
    description: "Edit mission, philosophy and school info",
    href: "/admin/about",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
  {
    title: "Programs",
    description: "Edit academic program descriptions",
    href: "/admin/programs",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Admissions",
    description: "Edit admissions process and info",
    href: "/admin/admissions",
    color: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    textColor: "text-pink-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Events",
    description: "Create, edit and delete school events",
    href: "/admin/events",
    color: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Contact",
    description: "Update school address, phone and email",
    href: "/admin/contact",
    color: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
    textColor: "text-cyan-600",
    span: "col-span-1",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    title: "Inquiries",
    description: "View and respond to contact form messages",
    href: "/admin/inquiries",
    color: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    span: "col-span-1 sm:col-span-2",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ unreadInquiries: 0, upcomingEvents: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [inquiriesRes, eventsRes] = await Promise.all([
          apiFetch("/api/inquiries"),
          apiFetch("/api/events"),
        ]);

        if (inquiriesRes.ok) {
          const inquiries = await inquiriesRes.json();
          const unread = inquiries.filter(
            (i: { status: string }) => i.status === "unread"
          ).length;
          setStats((s) => ({ ...s, unreadInquiries: unread }));
        }

        if (eventsRes.ok) {
          const events = await eventsRes.json();
          const today = new Date().toISOString().split("T")[0];
          const upcoming = events.filter(
            (e: { date: string }) => e.date >= today
          ).length;
          setStats((s) => ({ ...s, upcomingEvents: upcoming }));
        }
      } catch {
        // Stats are best-effort
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-primary-100 mt-1 text-sm sm:text-base">
            Here&apos;s an overview of your school website.
          </p>
        </div>
      </div>

      {/* Stats bento row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/inquiries"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-zinc-200/80 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Unread Inquiries</p>
              <p className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {stats.unreadInquiries}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        <Link
          href="/admin/events"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-zinc-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Upcoming Events</p>
              <p className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                {stats.upcomingEvents}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 border border-zinc-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Quick Actions</p>
          <div className="mt-3 space-y-2">
            <Link href="/admin/events" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-primary-600 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Create Event
            </Link>
            <Link href="/admin/media" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-primary-600 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Upload Media
            </Link>
            <Link href="/admin/inquiries" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-primary-600 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              View Inquiries
            </Link>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-zinc-800">Manage Content</h2>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Bento quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${link.span} group relative overflow-hidden rounded-2xl bg-white p-5 border border-zinc-200/80 hover:shadow-lg hover:shadow-zinc-200/50 hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-11 h-11 ${link.bgLight} ${link.textColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {link.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-zinc-800 text-sm">{link.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{link.description}</p>
              </div>
              <svg className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${link.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </Link>
        ))}
      </div>
    </div>
  );
}
