"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AdmissionsContent {
  tuitionInfo: string;
  faqs: FaqItem[];
}

const DEFAULT_TUITION_INFO =
  "Our admission process is tailored to the needs of our students and does not follow the Single Window system. For details on admission procedures, tuition, and fees, please contact the school office.";

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "1",
    question: "When does admission for LKG to Class X begin?",
    answer:
      "Admission to classes from LKG to X starts from the month of May.",
  },
  {
    id: "2",
    question: "When can we apply for Plus One (Higher Secondary)?",
    answer:
      "Plus One admission starts soon after the publication of SSLC results. We offer both Science and Commerce streams.",
  },
  {
    id: "3",
    question: "What teaching method is used?",
    answer:
      "The school uses the total communication method for the teaching-learning process to best suit the needs of our students.",
  },
];

const PAGE_KEY = "admissions";

const inputClasses =
  "mt-1 block w-full px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all duration-200";

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function ManageAdmissions() {
  const [form, setForm] = useState<AdmissionsContent>({
    tuitionInfo: DEFAULT_TUITION_INFO,
    faqs: DEFAULT_FAQS,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await apiFetch(`/api/content/${PAGE_KEY}`);
        if (res.ok) {
          const data: AdmissionsContent = await res.json();
          setForm({
            tuitionInfo: data.tuitionInfo ?? DEFAULT_TUITION_INFO,
            faqs:
              Array.isArray(data.faqs) && data.faqs.length > 0
                ? data.faqs.map((f, i) => ({
                    id: f.id ?? `${i}-${Date.now()}`,
                    question: f.question ?? "",
                    answer: f.answer ?? "",
                  }))
                : DEFAULT_FAQS,
          });
        }
      } catch {
        // Use default values if not yet saved
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(() => {
        setStatus("idle");
        setErrorMsg(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    try {
      const res = await apiFetch(`/api/content/${PAGE_KEY}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save changes");
      setStatus("error");
    }
  };

  const addFaq = () => {
    setForm((f) => ({
      ...f,
      faqs: [
        ...f.faqs,
        {
          id: Date.now().toString(),
          question: "",
          answer: "",
        },
      ],
    }));
  };

  const deleteFaq = (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setForm((f) => ({
      ...f,
      faqs: f.faqs.filter((item) => item.id !== id),
    }));
  };

  const updateFaq = (id: string, field: "question" | "answer", value: string) => {
    setForm((f) => ({
      ...f,
      faqs: f.faqs.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[40vh]"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading admissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Manage Admissions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update tuition information and frequently asked questions
          </p>
        </div>
        {status === "success" && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl animate-fade-in"
            aria-live="polite"
          >
            <CheckIcon />
            Saved successfully!
          </span>
        )}
      </div>

      {/* Error Banner */}
      {status === "error" && errorMsg && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 animate-slide-up"
          role="alert"
        >
          <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-red-700 dark:text-red-400 pt-1">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tuition Card */}
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700/50">
            <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
              Tuition & Financial Aid Info
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
              Tuition information
            </label>
            <textarea
              rows={6}
              value={form.tuitionInfo}
              onChange={(e) =>
                setForm((f) => ({ ...f, tuitionInfo: e.target.value }))
              }
              className={inputClasses}
            />
          </div>
        </div>

        {/* FAQs Card */}
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
              Frequently Asked Questions
            </h2>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
              {form.faqs.length} FAQ{form.faqs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="p-6 space-y-4">
            {form.faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="relative p-5 bg-zinc-50/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-200 group"
              >
                {/* FAQ Number Badge */}
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-xs font-bold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteFaq(faq.id)}
                    className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:text-zinc-600 dark:hover:text-red-400 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete FAQ"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      updateFaq(faq.id, "question", e.target.value)
                    }
                    placeholder="Enter the question"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                    Answer
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) =>
                      updateFaq(faq.id, "answer", e.target.value)
                    }
                    placeholder="Enter the answer"
                    className={inputClasses}
                  />
                </div>
              </div>
            ))}

            {/* Add FAQ Button */}
            <button
              type="button"
              onClick={addFaq}
              className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/10 text-zinc-400 hover:text-primary-600 dark:text-zinc-500 dark:hover:text-primary-400 transition-all duration-200 group/add"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover/add:bg-primary-100 dark:group-hover/add:bg-primary-950/30 flex items-center justify-center transition-colors duration-200">
                <PlusIcon />
              </div>
              <span className="text-sm font-medium">Add FAQ</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
          >
            {status === "saving" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
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
