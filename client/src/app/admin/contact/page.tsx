"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface ContactEntry {
  id: number;
  info_type: string;
  label: string;
  value: string;
  /** Google Maps URL (address rows only). */
  maps_url?: string | null;
  is_primary: boolean;
}

const inputClasses =
  "mt-1 block w-full px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-colors duration-200";

const TYPE_LABELS: Record<string, string> = {
  address: "Address",
  phone: "Phone",
  email: "Email",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  address: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
};

const TYPE_COLORS: Record<string, { bg: string; icon: string; border: string }> = {
  address: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-700/40",
  },
  phone: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-700/40",
  },
  email: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/60 dark:border-blue-700/40",
  },
};

export default function ManageContactPage() {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<Record<number, { type: "success" | "error"; msg: string }>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/media/contact");
        if (res.ok) setEntries(await res.json());
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function updateField(id: number, field: "value" | "label" | "maps_url", val: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  }

  async function handleSave(entry: ContactEntry) {
    setSaving(entry.id);
    setStatuses((s) => {
      const next = { ...s };
      delete next[entry.id];
      return next;
    });
    try {
      const body: Record<string, unknown> = { value: entry.value, label: entry.label };
      if (entry.info_type === "address") {
        const trimmed = entry.maps_url?.trim();
        body.maps_url = trimmed ? trimmed : null;
      }
      const res = await apiFetch(`/api/media/contact/${entry.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as {
        entry?: ContactEntry;
      } | null;
      if (!res.ok) throw new Error("Failed to save");
      if (data?.entry) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? {
                  ...e,
                  value: data.entry!.value ?? e.value,
                  label: data.entry!.label ?? e.label,
                  maps_url:
                    data.entry!.maps_url !== undefined
                      ? data.entry!.maps_url
                      : e.maps_url,
                }
              : e
          )
        );
      }
      setStatuses((s) => ({ ...s, [entry.id]: { type: "success", msg: "Saved!" } }));
    } catch {
      setStatuses((s) => ({ ...s, [entry.id]: { type: "error", msg: "Failed to save." } }));
    } finally {
      setSaving(null);
      setTimeout(
        () =>
          setStatuses((s) => {
            const next = { ...s };
            delete next[entry.id];
            return next;
          }),
        3000
      );
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
          Contact Information
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Manage how visitors can reach you
        </p>
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm p-12 text-center">
          <div className="inline-flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        </div>
      </div>
    );
  }

  const grouped = entries.reduce<Record<string, ContactEntry[]>>((acc, e) => {
    const t = e.info_type;
    if (!acc[t]) acc[t] = [];
    acc[t].push(e);
    return acc;
  }, {});

  const typeOrder = ["address", "phone", "email"];
  const sortedTypes = Object.keys(grouped).sort(
    (a, b) => (typeOrder.indexOf(a) === -1 ? 99 : typeOrder.indexOf(a)) - (typeOrder.indexOf(b) === -1 ? 99 : typeOrder.indexOf(b))
  );

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
          Contact Information
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Changes here will be reflected in the website footer and Contact page.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedTypes.map((type, idx) => {
          const items = grouped[type];
          const colors = TYPE_COLORS[type] ?? { bg: "bg-zinc-50 dark:bg-zinc-700/30", icon: "text-zinc-600 dark:text-zinc-400", border: "border-zinc-200/60 dark:border-zinc-700/40" };
          const isAddress = type === "address";

          return (
            <div
              key={type}
              className={`animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
                isAddress ? "md:col-span-2" : ""
              }`}
              style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "both" }}
            >
              {/* Card header with colored icon */}
              <div className={`px-6 py-4 border-b ${colors.border} ${colors.bg} flex items-center gap-3`}>
                <div className={`${colors.icon}`}>
                  {TYPE_ICONS[type] ?? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white capitalize">
                  {TYPE_LABELS[type] ?? type}
                </h2>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-6">
                {items.map((entry) => (
                  <div key={entry.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`label-${entry.id}`}
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        Label
                      </label>
                      {entry.is_primary && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-1 ring-inset ring-primary-600/20 dark:ring-primary-400/30 px-2.5 py-0.5 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Primary
                        </span>
                      )}
                    </div>
                    <input
                      id={`label-${entry.id}`}
                      type="text"
                      value={entry.label}
                      onChange={(e) => updateField(entry.id, "label", e.target.value)}
                      className={inputClasses}
                      placeholder="e.g. Office Phone"
                    />

                    <label
                      htmlFor={`value-${entry.id}`}
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {type === "address"
                        ? "Full Address"
                        : type === "email"
                        ? "Email Address"
                        : "Phone Number"}
                    </label>
                    {type === "address" ? (
                      <>
                        <textarea
                          id={`value-${entry.id}`}
                          rows={3}
                          value={entry.value}
                          onChange={(e) => updateField(entry.id, "value", e.target.value)}
                          className={inputClasses}
                        />
                        <label
                          htmlFor={`maps-${entry.id}`}
                          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-4"
                        >
                          Google Maps link
                        </label>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-1">
                          Paste a share link or directions URL from Google Maps. It will appear as &quot;View on Google Maps&quot; on the Contact page.
                        </p>
                        <input
                          id={`maps-${entry.id}`}
                          type="text"
                          inputMode="url"
                          autoComplete="off"
                          placeholder="https://maps.app.goo.gl/..."
                          value={entry.maps_url ?? ""}
                          onChange={(e) => updateField(entry.id, "maps_url", e.target.value)}
                          className={inputClasses}
                        />
                      </>
                    ) : (
                      <input
                        id={`value-${entry.id}`}
                        type={type === "email" ? "email" : "text"}
                        value={entry.value}
                        onChange={(e) => updateField(entry.id, "value", e.target.value)}
                        className={inputClasses}
                      />
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSave(entry)}
                        disabled={saving === entry.id}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:bg-none dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg rounded-xl disabled:opacity-70 shadow-sm shadow-primary-600/20 dark:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        {saving === entry.id ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving…
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                      {statuses[entry.id] && (
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-opacity duration-300 ${
                            statuses[entry.id].type === "success"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {statuses[entry.id].type === "success" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {statuses[entry.id].msg}
                        </span>
                      )}
                    </div>

                    {items.indexOf(entry) < items.length - 1 && (
                      <div className="border-t border-zinc-100 dark:border-zinc-700/50 pt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
