"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeAuthToken } from "@/lib/auth";
import { buildApiUrl } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await res.json().catch(() => null)) as
        | { token?: string; error?: string }
        | null;

      if (!res.ok || !payload?.token) {
        throw new Error(payload?.error || "Invalid email or password.");
      }

      writeAuthToken(payload.token);
      router.replace("/admin");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to log in right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-hc-interactive dark:focus:border-hc-interactive";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 shadow-xl rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-zinc-700 rounded-full mb-4">
            <svg className="w-7 h-7 text-primary-600 dark:text-hc-interactive" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Staff Login
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Authorised school staff only
          </p>
        </div>

        {error && (
          <div
            className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
            aria-live="assertive"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="admin@csihssmanakala.edu"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className={inputClasses}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-hc-bg bg-primary-600 hover:bg-primary-700 dark:bg-hc-interactive dark:hover:bg-hc-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
