"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

type ContactRow = {
  id: number;
  info_type: string;
  label: string;
  value: string;
  maps_url?: string | null;
  is_primary: boolean;
};

function normalizeExternalUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function pickPrimary(rows: ContactRow[], type: string): ContactRow | undefined {
  const list = rows.filter((r) => r.info_type === type);
  const primary = list.find((r) => r.is_primary);
  return primary ?? list[0];
}

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [contactRows, setContactRows] = useState<ContactRow[] | null>(null);
  const [contactLoadFailed, setContactLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(buildApiUrl("/api/media/contact"), {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load contact");
        const data = (await res.json()) as ContactRow[];
        if (!cancelled) {
          setContactRows(Array.isArray(data) ? data : []);
          setContactLoadFailed(false);
        }
      } catch {
        if (!cancelled) {
          setContactRows([]);
          setContactLoadFailed(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch(buildApiUrl("/api/inquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setStatus("success");
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const inputClasses =
    "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive text-zinc-900 dark:text-white";

  const addressEntry =
    contactRows !== null ? pickPrimary(contactRows, "address") : undefined;
  const phoneEntry =
    contactRows !== null ? pickPrimary(contactRows, "phone") : undefined;
  const emailEntry =
    contactRows !== null ? pickPrimary(contactRows, "email") : undefined;

  const addressText = addressEntry?.value?.trim() ?? "";
  const mapsUrlRaw = addressEntry?.maps_url?.trim() ?? "";
  const mapsHref = mapsUrlRaw ? normalizeExternalUrl(mapsUrlRaw) : "";
  const phoneDisplay = phoneEntry?.value?.trim() ?? "";
  const telHref = phoneDisplay ? `tel:${phoneDisplay.replace(/\s/g, "")}` : "";
  const emailDisplay = emailEntry?.value?.trim() ?? "";
  const emailHref = emailDisplay ? `mailto:${emailDisplay}` : "";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-hc-text mb-8 text-center">
          Contact Us
        </h1>

        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2 border border-zinc-200 dark:border-zinc-700">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-6">
              Send a Message
            </h2>

            {status === "success" && (
              <div
                className="mb-6 p-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md"
                aria-live="polite"
              >
                Thank you for your message. We will get back to you shortly.
              </div>
            )}

            {status === "error" && (
              <div
                className="mb-6 p-4 bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-md"
                aria-live="assertive"
              >
                An error occurred. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={inputClasses}
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className={inputClasses}
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-6">
              Contact Information
            </h2>

            {contactRows === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
                Loading contact information…
              </p>
            ) : (
              <address className="not-italic space-y-4">
                {contactLoadFailed && (
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Could not load the latest contact details. Please try again later or use the links in the site footer.
                  </p>
                )}

                <div>
                  <strong className="block text-zinc-900 dark:text-white mb-1">
                    Address:
                  </strong>
                  {addressText ? (
                    <p className="whitespace-pre-line">{addressText}</p>
                  ) : (
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                      Address will appear here once it is saved in the admin panel.
                    </p>
                  )}
                  {mapsHref ? (
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-primary-600 dark:text-hc-interactive font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View on Google Maps
                    </a>
                  ) : null}
                </div>

                {phoneDisplay ? (
                  <p>
                    <strong className="block text-zinc-900 dark:text-white">
                      Phone:
                    </strong>
                    <a
                      href={telHref}
                      className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      {phoneDisplay}
                    </a>
                  </p>
                ) : (
                  <p>
                    <strong className="block text-zinc-900 dark:text-white">
                      Phone:
                    </strong>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                      Not listed. Please email us or use the contact form.
                    </span>
                  </p>
                )}

                {emailDisplay ? (
                  <p>
                    <strong className="block text-zinc-900 dark:text-white">
                      Email:
                    </strong>
                    <a
                      href={emailHref}
                      className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded break-all"
                    >
                      {emailDisplay}
                    </a>
                  </p>
                ) : (
                  <p>
                    <strong className="block text-zinc-900 dark:text-white">
                      Email:
                    </strong>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                      Not listed. Please use the form on the left.
                    </span>
                  </p>
                )}
              </address>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
