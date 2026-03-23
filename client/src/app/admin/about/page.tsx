"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch, buildApiUrl } from "@/lib/api";
import { readAuthToken } from "@/lib/auth";

interface AboutContent {
  mission: string;
  philosophy: string;
}

interface Leader {
  id: string;
  full_name: string;
  position_title: string;
  photo_url: string | null;
  tenure_period: string;
  bio: string;
}

interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  alt_text: string;
}

const DEFAULT: AboutContent = {
  mission:
    "To provide quality education and a nurturing environment for students with partial hearing, empowering them to achieve their full potential through specialised instruction, speech therapy, and inclusive learning.",
  philosophy:
    "We believe every child, regardless of hearing ability, deserves access to excellent education. Our approach combines total communication methods, therapeutic support, and a compassionate community to ensure each student thrives academically and personally.",
};

const PAGE_KEY = "about";

function InlineImageUpload({
  currentUrl,
  shape,
  alt,
  uploading,
  onFileSelect,
}: {
  currentUrl: string | null;
  shape: "circle" | "square";
  alt: string;
  uploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const shapeClass = shape === "circle" ? "rounded-full w-20 h-20" : "rounded-xl w-24 h-24";

  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2">
      <div
        className={`relative bg-zinc-100 dark:bg-zinc-700 overflow-hidden flex items-center justify-center ring-2 ring-zinc-200/60 dark:ring-zinc-600 ${shapeClass}`}
      >
        {currentUrl ? (
          <img src={currentUrl} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-600 disabled:opacity-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 font-medium"
      >
        {uploading ? "Uploading…" : currentUrl ? "Change" : "Upload"}
      </button>
    </div>
  );
}

export default function ManageAboutPage() {
  const [form, setForm] = useState<AboutContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [savingLeaderId, setSavingLeaderId] = useState<string | null>(null);
  const [addingLeader, setAddingLeader] = useState(false);
  const [uploadingLeaderId, setUploadingLeaderId] = useState<string | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [savingFacilityId, setSavingFacilityId] = useState<string | null>(null);
  const [addingFacility, setAddingFacility] = useState(false);
  const [uploadingFacilityId, setUploadingFacilityId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [contentRes, leadershipRes, facilitiesRes] = await Promise.all([
          apiFetch(`/api/content/${PAGE_KEY}`),
          apiFetch("/api/media/leadership"),
          apiFetch("/api/media/facilities"),
        ]);

        if (contentRes.ok) {
          const data = await contentRes.json();
          setForm({
            mission: data?.mission ?? DEFAULT.mission,
            philosophy: data?.philosophy ?? DEFAULT.philosophy,
          });
        }

        if (leadershipRes.ok) {
          const data: Leader[] = await leadershipRes.json();
          setLeaders(
            (Array.isArray(data) ? data : []).map((l) => ({
              ...l,
              full_name: l.full_name ?? "",
              position_title: l.position_title ?? "",
              tenure_period: l.tenure_period ?? "",
              bio: l.bio ?? "",
              photo_url: l.photo_url ?? null,
            }))
          );
        }

        if (facilitiesRes.ok) {
          const data: Facility[] = await facilitiesRes.json();
          setFacilities(
            (Array.isArray(data) ? data : []).map((f) => ({
              ...f,
              name: f.name ?? "",
              description: f.description ?? "",
              alt_text: f.alt_text ?? "",
              image_url: f.image_url ?? null,
            }))
          );
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await apiFetch(`/api/content/${PAGE_KEY}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus({ type: "success", msg: "About page content updated successfully!" });
    } catch {
      setStatus({ type: "error", msg: "Failed to update. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const handleAddLeader = useCallback(async () => {
    setAddingLeader(true);
    try {
      const res = await apiFetch("/api/media/leadership", {
        method: "POST",
        body: JSON.stringify({
          full_name: "",
          position_title: "",
          tenure_period: "",
          bio: "",
        }),
      });
      if (!res.ok) throw new Error("Failed to add leader");
      const raw = await res.json();
      const leader = raw?.data ?? raw;
      setLeaders((prev) => [
        ...prev,
        {
          ...leader,
          full_name: leader.full_name ?? "",
          position_title: leader.position_title ?? "",
          tenure_period: leader.tenure_period ?? "",
          bio: leader.bio ?? "",
          photo_url: leader.photo_url ?? null,
        },
      ]);
    } catch {
      setStatus({ type: "error", msg: "Failed to add leader." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setAddingLeader(false);
    }
  }, []);

  const handleSaveLeader = useCallback(async (leader: Leader) => {
    setSavingLeaderId(leader.id);
    try {
      const res = await apiFetch(`/api/media/leadership/${leader.id}`, {
        method: "PUT",
        body: JSON.stringify({
          full_name: leader.full_name,
          position_title: leader.position_title,
          tenure_period: leader.tenure_period,
          bio: leader.bio,
        }),
      });
      if (!res.ok) throw new Error("Failed to save leader");
    } catch {
      setStatus({ type: "error", msg: "Failed to save leader." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSavingLeaderId(null);
    }
  }, []);

  const handleDeleteLeader = useCallback(async (leader: Leader) => {
    if (!confirm(`Delete ${leader.full_name || "this leader"}?`)) return;
    try {
      const res = await apiFetch(`/api/media/leadership/${leader.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLeaders((prev) => prev.filter((l) => l.id !== leader.id));
    } catch {
      setStatus({ type: "error", msg: "Failed to delete leader." });
      setTimeout(() => setStatus(null), 4000);
    }
  }, []);

  const handleAddFacility = useCallback(async () => {
    setAddingFacility(true);
    try {
      const res = await apiFetch("/api/media/facilities", {
        method: "POST",
        body: JSON.stringify({ name: "", description: "", alt_text: "" }),
      });
      if (!res.ok) throw new Error("Failed to add facility");
      const raw = await res.json();
      const facility = raw?.data ?? raw;
      setFacilities((prev) => [
        ...prev,
        {
          ...facility,
          name: facility.name ?? "",
          description: facility.description ?? "",
          alt_text: facility.alt_text ?? "",
          image_url: facility.image_url ?? null,
        },
      ]);
    } catch {
      setStatus({ type: "error", msg: "Failed to add facility." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setAddingFacility(false);
    }
  }, []);

  const handleSaveFacility = useCallback(async (facility: Facility) => {
    setSavingFacilityId(facility.id);
    try {
      const res = await apiFetch(`/api/media/facilities/${facility.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: facility.name,
          description: facility.description,
          alt_text: facility.alt_text,
        }),
      });
      if (!res.ok) throw new Error("Failed to save facility");
    } catch {
      setStatus({ type: "error", msg: "Failed to save facility." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSavingFacilityId(null);
    }
  }, []);

  const handleDeleteFacility = useCallback(async (facility: Facility) => {
    if (!confirm(`Delete ${facility.name || "this facility"}?`)) return;
    try {
      const res = await apiFetch(`/api/media/facilities/${facility.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setFacilities((prev) => prev.filter((f) => f.id !== facility.id));
    } catch {
      setStatus({ type: "error", msg: "Failed to delete facility." });
      setTimeout(() => setStatus(null), 4000);
    }
  }, []);

  const handleUploadLeaderPhoto = useCallback(async (leaderId: string, file: File) => {
    setUploadingLeaderId(leaderId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = readAuthToken();
      const res = await fetch(buildApiUrl(`/api/media/leadership/${leaderId}/photo`), {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newUrl = data?.leader?.photo_url ?? data?.photo_url ?? null;
      setLeaders((prev) =>
        prev.map((l) => (l.id === leaderId ? { ...l, photo_url: newUrl } : l))
      );
      setStatus({ type: "success", msg: "Photo uploaded successfully!" });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus({ type: "error", msg: "Photo upload failed. Please try again." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setUploadingLeaderId(null);
    }
  }, []);

  const handleUploadFacilityImage = useCallback(async (facilityId: string, file: File) => {
    setUploadingFacilityId(facilityId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = readAuthToken();
      const res = await fetch(buildApiUrl(`/api/media/facilities/${facilityId}/image`), {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newUrl = data?.facility?.image_url ?? data?.image_url ?? null;
      setFacilities((prev) =>
        prev.map((f) => (f.id === facilityId ? { ...f, image_url: newUrl } : f))
      );
      setStatus({ type: "success", msg: "Image uploaded successfully!" });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus({ type: "error", msg: "Image upload failed. Please try again." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setUploadingFacilityId(null);
    }
  }, []);

  const updateLeader = useCallback((id: string, upd: Partial<Leader>) => {
    setLeaders((prev) => prev.map((l) => (l.id === id ? { ...l, ...upd } : l)));
  }, []);

  const updateFacility = useCallback((id: string, upd: Partial<Facility>) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, ...upd } : f)));
  }, []);

  const inputClasses =
    "block w-full px-3.5 py-2.5 bg-zinc-50/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive transition-all duration-200";

  const labelClasses = "block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1.5";

  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Toast notifications */}
      {status && (
        <div
          className={`fixed top-6 right-6 z-50 animate-slide-up flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border ${
            status.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
          }`}
          role="status"
        >
          {status.type === "success" ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
          <span className="text-sm font-medium">{status.msg}</span>
        </div>
      )}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Manage About Page
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Edit mission, philosophy, leadership, and facilities. Photos and images can also be managed in{" "}
          <Link href="/admin/media" className="text-primary-600 dark:text-hc-interactive hover:underline font-medium">
            Media &amp; Images
          </Link>
          .
        </p>
      </div>

      {/* General Content */}
      <form onSubmit={handleSaveContent} className="mb-10">
        <div className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-500 to-primary-700" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">General Content</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="about-mission" className={labelClasses}>
                Our Mission
              </label>
              <textarea
                id="about-mission"
                rows={4}
                value={form.mission}
                onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
                className={`${inputClasses} resize-none`}
              />
            </div>
            <div>
              <label htmlFor="about-philosophy" className={labelClasses}>
                Our Philosophy
              </label>
              <textarea
                id="about-philosophy"
                rows={5}
                value={form.philosophy}
                onChange={(e) => setForm((f) => ({ ...f, philosophy: e.target.value }))}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save Content"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Leadership Team */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-purple-600" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Leadership Team</h2>
          {leaders.length > 0 && (
            <span className="text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full">
              {leaders.length}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-5">
                <InlineImageUpload
                  currentUrl={leader.photo_url}
                  shape="circle"
                  alt={leader.full_name || "Leader photo"}
                  uploading={uploadingLeaderId === leader.id}
                  onFileSelect={(file) => handleUploadLeaderPhoto(leader.id, file)}
                />
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClasses}>Full Name</label>
                      <input
                        type="text"
                        value={leader.full_name}
                        onChange={(e) => updateLeader(leader.id, { full_name: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Position</label>
                      <input
                        type="text"
                        value={leader.position_title}
                        onChange={(e) => updateLeader(leader.id, { position_title: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Tenure Period</label>
                    <input
                      type="text"
                      value={leader.tenure_period}
                      onChange={(e) => updateLeader(leader.id, { tenure_period: e.target.value })}
                      placeholder="e.g. 2020 – Present"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Bio</label>
                    <textarea
                      rows={3}
                      value={leader.bio}
                      onChange={(e) => updateLeader(leader.id, { bio: e.target.value })}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveLeader(leader)}
                      disabled={savingLeaderId === leader.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {savingLeaderId === leader.id ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLeader(leader)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Leader — dashed card */}
          <button
            type="button"
            onClick={handleAddLeader}
            disabled={addingLeader}
            className="w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-violet-300 hover:text-violet-500 dark:hover:border-hc-interactive/50 dark:hover:text-hc-interactive disabled:opacity-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            <span className="text-sm font-medium">{addingLeader ? "Adding…" : "Add New Leader"}</span>
          </button>
        </div>
      </div>

      {/* Facilities */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Facilities</h2>
          {facilities.length > 0 && (
            <span className="text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              {facilities.length}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-5">
                <InlineImageUpload
                  currentUrl={facility.image_url}
                  shape="square"
                  alt={facility.alt_text || facility.name || "Facility image"}
                  uploading={uploadingFacilityId === facility.id}
                  onFileSelect={(file) => handleUploadFacilityImage(facility.id, file)}
                />
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <label className={labelClasses}>Name</label>
                    <input
                      type="text"
                      value={facility.name}
                      onChange={(e) => updateFacility(facility.id, { name: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Description</label>
                    <textarea
                      rows={2}
                      value={facility.description}
                      onChange={(e) => updateFacility(facility.id, { description: e.target.value })}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Alt Text</label>
                    <input
                      type="text"
                      value={facility.alt_text}
                      onChange={(e) => updateFacility(facility.id, { alt_text: e.target.value })}
                      placeholder="Accessibility description"
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveFacility(facility)}
                      disabled={savingFacilityId === facility.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {savingFacilityId === facility.id ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFacility(facility)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Facility — dashed card */}
          <button
            type="button"
            onClick={handleAddFacility}
            disabled={addingFacility}
            className="w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-emerald-300 hover:text-emerald-500 dark:hover:border-hc-interactive/50 dark:hover:text-hc-interactive disabled:opacity-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm font-medium">{addingFacility ? "Adding…" : "Add New Facility"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
