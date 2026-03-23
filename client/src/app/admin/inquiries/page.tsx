"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

type StatusFilter = "all" | "unread" | "read" | "replied";

const STATUS_LABELS: Record<Inquiry["status"], string> = {
  unread: "New",
  read: "Read",
  replied: "Replied",
};

const STATUS_CLASSES: Record<Inquiry["status"], string> = {
  unread:
    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/30",
  read:
    "bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-700/50 dark:text-zinc-300 dark:ring-zinc-500/20",
  replied:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-400/30",
};

const FILTER_ICONS: Record<StatusFilter, React.ReactNode> = {
  all: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v1H2V6zm0 3h16v5a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
    </svg>
  ),
  unread: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  read: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ),
  replied: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
};

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchInquiries() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to load inquiries");
      setInquiries(await res.json());
    } catch {
      setError("Could not load inquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`/api/inquiries/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
    } catch {
      alert("Could not update the inquiry status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const displayed =
    filter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filter);

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Inquiries
          </h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-primary-600 text-white px-3 py-1 rounded-full shadow-sm shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={fetchInquiries}
          className="p-2.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-xl shadow-sm hover:shadow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Filter tabs — pill style */}
      <div className="flex gap-2 mb-6 p-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-xl w-fit">
        {(["all", "unread", "read", "replied"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium capitalize rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              filter === f
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {FILTER_ICONS[f]}
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200/80 dark:border-red-700 rounded-2xl text-red-700 dark:text-red-400 text-sm flex items-center gap-3" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
          <div className="p-12 text-center" aria-live="polite">
            <div className="inline-flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading inquiries…
            </div>
          </div>
        </div>
      ) : displayed.length === 0 ? (
        <div className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-700/50 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No inquiries found</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              No {filter === "all" ? "" : filter + " "}inquiries to show right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayed.map((inq, idx) => (
            <div
              key={inq.id}
              className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-zinc-300/80 dark:hover:border-zinc-600 transition-all duration-300 p-6"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
            >
              {/* Top row: name, badge, date */}
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar circle */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 dark:from-hc-interactive dark:to-hc-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-white dark:text-hc-bg">
                      {inq.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-white truncate">
                        {inq.name}
                      </h2>
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${STATUS_CLASSES[inq.status]}`}>
                        {STATUS_LABELS[inq.status]}
                      </span>
                    </div>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-sm text-primary-600 dark:text-hc-interactive hover:underline"
                    >
                      {inq.email}
                    </a>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 bg-zinc-50 dark:bg-zinc-700/50 px-2.5 py-1 rounded-lg">
                  {new Date(inq.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Message */}
              <div className="ml-13 pl-0 sm:ml-[52px]">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50/80 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/50 leading-relaxed">
                  {inq.message}
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  {inq.status === "unread" && (
                    <button
                      disabled={updatingId === inq.id}
                      onClick={() => updateStatus(inq.id, "read")}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3.5 py-1.5 rounded-lg disabled:opacity-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Mark as Read
                    </button>
                  )}
                  {inq.status !== "replied" && (
                    <button
                      disabled={updatingId === inq.id}
                      onClick={() => updateStatus(inq.id, "replied")}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 px-3.5 py-1.5 rounded-lg disabled:opacity-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {updatingId === inq.id ? "Updating…" : "Mark as Replied"}
                    </button>
                  )}
                  <a
                    href={`mailto:${inq.email}?subject=Re: Your enquiry to CSI HSS Manakala`}
                    onClick={() => {
                      if (inq.status === "unread") updateStatus(inq.id, "read");
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-hc-interactive hover:text-primary-800 dark:hover:text-hc-accent bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-3.5 py-1.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
