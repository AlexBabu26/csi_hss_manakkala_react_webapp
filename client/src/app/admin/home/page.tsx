"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface HomeContent {
  heroHeading: string;
  heroSubheading: string;
  features: { id: string; title: string; description: string }[];
  testimonials: { id: string; name: string; role: string; quote: string; imageUrl: string }[];
}

const DEFAULT_DATA: HomeContent = {
  heroHeading: "C.S.I. HSS For The Partially Hearing, Manakala, Adoor",
  heroSubheading:
    "Established in 1981, we provide a supportive and engaging environment, empowering students with hearing impairments through quality education.",
  features: [
    { id: "f1", title: "Total Communication", description: "We use multiple modes of communication to support learning." },
    { id: "f2", title: "SCERT Certified Syllabus", description: "Curriculum aligned with state board standards for quality education." },
    { id: "f3", title: "Holistic Development", description: "Focus on academic, social, and life skills for every student." },
  ],
  testimonials: [],
};

function generateId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const FEATURE_ICONS = [
  <svg key="comm" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  <svg key="cert" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
  <svg key="holistic" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>,
];

export default function ManageHome() {
  const [formData, setFormData] = useState<HomeContent>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await apiFetch("/api/content/home");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            heroHeading: data.heroHeading ?? DEFAULT_DATA.heroHeading,
            heroSubheading: data.heroSubheading ?? DEFAULT_DATA.heroSubheading,
            features: Array.isArray(data.features) && data.features.length >= 3
              ? data.features.slice(0, 3).map((f: { id?: string; title?: string; description?: string }, i: number) => ({
                  id: f.id ?? `f${i + 1}`,
                  title: f.title ?? DEFAULT_DATA.features[i]?.title ?? "",
                  description: f.description ?? DEFAULT_DATA.features[i]?.description ?? "",
                }))
              : DEFAULT_DATA.features,
            testimonials: Array.isArray(data.testimonials)
              ? data.testimonials.map((t: { id?: string; name?: string; role?: string; quote?: string; imageUrl?: string }) => ({
                  id: t.id ?? generateId(),
                  name: t.name ?? "",
                  role: t.role ?? "",
                  quote: t.quote ?? "",
                  imageUrl: t.imageUrl ?? "",
                }))
              : DEFAULT_DATA.testimonials,
          });
        }
      } catch {
        setFormData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    try {
      const res = await apiFetch("/api/content/home", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save");
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save changes");
      setStatus("error");
    }
  };

  const updateFeature = (index: number, field: "title" | "description", value: string) => {
    setFormData((prev) => {
      const next = [...prev.features];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, features: next };
    });
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { id: generateId(), name: "", role: "", quote: "", imageUrl: "" },
      ],
    }));
  };

  const removeTestimonial = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  const updateTestimonial = (id: string, field: keyof HomeContent["testimonials"][0], value: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[40vh]" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading content…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Toast notifications */}
      {status === "success" && (
        <div
          className="fixed top-6 right-6 z-50 animate-slide-up flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl shadow-lg"
          aria-live="polite"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="text-sm font-medium">Saved successfully!</span>
        </div>
      )}
      {status === "error" && errorMsg && (
        <div
          className="fixed top-6 right-6 z-50 animate-slide-up flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2.5 rounded-xl shadow-lg max-w-sm"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Manage Home Page
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Edit the hero section, features, and testimonials displayed on the public home page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Bento grid: Hero + Features side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Hero Section — takes 3 cols */}
          <div className="lg:col-span-3 animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-500 to-primary-700" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Hero Section</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="heroHeading"
                  className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1.5"
                >
                  Heading
                </label>
                <input
                  type="text"
                  id="heroHeading"
                  value={formData.heroHeading}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, heroHeading: e.target.value }))
                  }
                  className="block w-full px-3.5 py-2.5 bg-zinc-50/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="heroSubheading"
                  className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1.5"
                >
                  Subheading
                </label>
                <textarea
                  id="heroSubheading"
                  rows={3}
                  value={formData.heroSubheading}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, heroSubheading: e.target.value }))
                  }
                  className="block w-full px-3.5 py-2.5 bg-zinc-50/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Features Section — takes 2 cols, stacked vertically */}
          <div className="lg:col-span-2 animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Why Choose Us</h2>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-700/50 space-y-3 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 text-primary-600 dark:text-hc-interactive">
                    {FEATURE_ICONS[index]}
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Feature {index + 1}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section — full width */}
        <div className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-purple-600" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Testimonials</h2>
              {formData.testimonials.length > 0 && (
                <span className="ml-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                  {formData.testimonials.length}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {formData.testimonials.length === 0 && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-6">
                No testimonials yet. Add one to get started.
              </p>
            )}

            {formData.testimonials.map((t) => (
              <div
                key={t.id}
                className="group relative p-5 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-700/50 transition-all duration-200 hover:border-zinc-200 dark:hover:border-zinc-600"
              >
                <button
                  type="button"
                  onClick={() => removeTestimonial(t.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-2.5 py-1 rounded-lg"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Remove
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => updateTestimonial(t.id, "name", e.target.value)}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => updateTestimonial(t.id, "role", e.target.value)}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Quote
                  </label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => updateTestimonial(t.id, "quote", e.target.value)}
                    className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200 resize-none"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={t.imageUrl}
                    onChange={(e) => updateTestimonial(t.id, "imageUrl", e.target.value)}
                    className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}

            {/* Add Testimonial — dashed card */}
            <button
              type="button"
              onClick={addTestimonial}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-primary-300 hover:text-primary-500 dark:hover:border-hc-interactive/50 dark:hover:text-hc-interactive transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-sm font-medium">Add Testimonial</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {status === "saving" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
