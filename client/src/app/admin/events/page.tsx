"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

type FormState = {
  title: string;
  date: string;
  description: string;
};

const emptyForm: FormState = { title: "", date: "", description: "" };

function toDatetimeLocal(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function toISOString(datetimeLocal: string) {
  if (!datetimeLocal) return new Date().toISOString();
  return new Date(datetimeLocal).toISOString();
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/events");
      if (!res.ok) throw new Error("Failed to load events");
      setEvents(await res.json());
    } catch {
      setError("Could not load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(event: Event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: toDatetimeLocal(event.date),
      description: event.description || "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const body = {
      title: form.title.trim(),
      date: toISOString(form.date),
      description: form.description.trim(),
      images: [],
    };

    try {
      const res = editingId
        ? await apiFetch(`/api/events/${editingId}`, {
            method: "PUT",
            body: JSON.stringify(body),
          })
        : await apiFetch("/api/events", {
            method: "POST",
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save event");
      }

      closeModal();
      await fetchEvents();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Could not delete the event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const inputClasses =
    "mt-1 block w-full px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-colors duration-200";

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Manage Events
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create and manage your school events
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:bg-none dark:bg-hc-interactive dark:hover:bg-hc-accent text-white dark:text-hc-bg px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-600/20 dark:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Event
        </button>
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
              Loading events…
            </div>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-400 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No events yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              Click &ldquo;Add New Event&rdquo; to create your first event.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-zinc-300/80 dark:hover:border-zinc-600 transition-all duration-300 p-6 group"
              style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 min-w-0">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase leading-none">
                      {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold text-primary-700 dark:text-primary-200 leading-tight">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                      {event.title}
                    </h2>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" \u00b7 "}
                      {new Date(event.date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {event.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEdit(event)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-hc-interactive hover:text-primary-800 dark:hover:text-hc-accent bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-3 py-1.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {deletingId === event.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div className="animate-scale-in bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200/80 dark:border-zinc-700 overflow-hidden">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h2
                  id="event-modal-title"
                  className="text-xl font-semibold text-zinc-900 dark:text-white"
                >
                  {editingId ? "Edit Event" : "Add New Event"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200/80 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400 text-sm" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label htmlFor="event-title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Title <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={inputClasses}
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label htmlFor="event-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Date &amp; Time <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event-date"
                    type="datetime-local"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="event-description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="event-description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={inputClasses}
                    placeholder="Describe the event..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:bg-none dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg rounded-xl disabled:opacity-70 shadow-sm shadow-primary-600/20 dark:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {saving ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
