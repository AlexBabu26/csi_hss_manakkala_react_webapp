"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch, buildApiUrl } from "@/lib/api";
import { readAuthToken } from "@/lib/auth";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteSettings {
  site_logo?: string;
  csi_logo?: string;
  hearing_logo?: string;
  hero_image?: string;
  [key: string]: string | undefined;
}

interface Leader {
  id: number;
  full_name: string;
  position_title: string;
  photo_url: string;
}

interface Facility {
  id: number;
  name: string;
  image_url: string;
}

interface Program {
  id: number;
  name: string;
  image_url: string;
}

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadImage(
  endpoint: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = readAuthToken();
  const res = await fetch(buildApiUrl(endpoint), {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Upload failed");
  }

  const data = await res.json();
  return data.value ?? data.leader?.photo_url ?? data.facility?.image_url ?? data.program?.image_url ?? "";
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div
        className={`shrink-0 w-11 h-11 rounded-xl ${accentColor} flex items-center justify-center shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-hc-text tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-zinc-300 dark:text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
          />
        </svg>
      </div>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
        {message}
      </p>
    </div>
  );
}

// ─── ImageUploadCard ──────────────────────────────────────────────────────────

function ImageUploadCard({
  label,
  currentUrl,
  shape = "square",
  onUploaded,
  uploading,
  onFileSelect,
}: {
  label: string;
  currentUrl: string;
  shape?: "square" | "circle";
  onUploaded?: (url: string) => void;
  uploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = currentUrl && currentUrl.trim() !== "";
  const [justUploaded, setJustUploaded] = useState(false);
  const prevUploadingRef = useRef(uploading);

  useEffect(() => {
    if (prevUploadingRef.current && !uploading && hasImage) {
      setJustUploaded(true);
      const timer = setTimeout(() => setJustUploaded(false), 600);
      return () => clearTimeout(timer);
    }
    prevUploadingRef.current = uploading;
  }, [uploading, hasImage]);

  const labelLines = label.split("\n");

  return (
    <div className="group flex flex-col items-center">
      {/* Image container */}
      <div
        className={`
          relative overflow-hidden flex items-center justify-center
          transition-all duration-300 ease-out
          ${shape === "circle"
            ? "w-32 h-32 rounded-full"
            : "w-full aspect-[3/2] rounded-2xl"
          }
          ${hasImage
            ? "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm"
            : "bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-hc-interactive/50"
          }
          ${justUploaded ? "animate-scale-in" : ""}
          ${!uploading && !hasImage ? "cursor-pointer hover:bg-primary-50/50 dark:hover:bg-zinc-800" : ""}
        `}
        onClick={() => {
          if (!uploading && !hasImage) inputRef.current?.click();
        }}
      >
        {hasImage ? (
          <Image
            src={currentUrl}
            alt={labelLines[0]}
            fill
            className={`object-cover transition-transform duration-300 ${
              shape === "circle" ? "" : "group-hover:scale-[1.03]"
            }`}
            sizes="300px"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4">
            <svg
              className="w-8 h-8 text-zinc-300 dark:text-zinc-600 transition-colors group-hover:text-primary-400 dark:group-hover:text-hc-interactive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 text-center font-medium">
              Click to upload
            </span>
          </div>
        )}

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-xs font-medium">Uploading…</span>
          </div>
        )}

        {/* Hover overlay for existing images */}
        {hasImage && !uploading && (
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <div className="bg-white/90 dark:bg-zinc-900/90 rounded-xl px-3 py-1.5 shadow-lg">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                Change
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        {labelLines.map((line, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-sm font-medium text-zinc-700 dark:text-zinc-200 leading-snug"
                : "text-xs text-zinc-400 dark:text-zinc-500 leading-snug mt-0.5"
            }
          >
            {line}
          </p>
        ))}
      </div>

      {/* Hidden file input */}
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

      {/* Upload button */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`
          mt-3 text-xs font-semibold px-4 py-2 rounded-xl
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          ${hasImage
            ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 dark:hover:text-white"
            : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm hover:shadow-md dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg"
          }
        `}
      >
        {uploading ? "Uploading…" : hasImage ? "Replace" : "Upload Image"}
      </button>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`
        animate-slide-up fixed top-6 right-6 z-50
        flex items-center gap-2.5 pl-4 pr-5 py-3
        rounded-2xl shadow-lg backdrop-blur-sm
        ${type === "success"
          ? "bg-emerald-50/95 border border-emerald-200/80 text-emerald-700 dark:bg-emerald-900/90 dark:border-emerald-700/50 dark:text-emerald-300"
          : "bg-red-50/95 border border-red-200/80 text-red-700 dark:bg-red-900/90 dark:border-red-700/50 dark:text-red-300"
        }
      `}
      role={type === "error" ? "alert" : undefined}
      aria-live={type === "success" ? "polite" : undefined}
    >
      {type === "success" ? (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageMedia() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [settingsRes, leadersRes, facilitiesRes, programsRes] =
          await Promise.all([
            apiFetch("/api/media/settings"),
            apiFetch("/api/media/leadership"),
            apiFetch("/api/media/facilities"),
            apiFetch("/api/media/programs"),
          ]);

        if (settingsRes.ok) setSettings(await settingsRes.json());
        if (leadersRes.ok) setLeaders(await leadersRes.json());
        if (facilitiesRes.ok) setFacilities(await facilitiesRes.json());
        if (programsRes.ok) setPrograms(await programsRes.json());
      } catch {
        setErrorMsg("Failed to load media data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 3500);
  }

  function showError(msg: string) {
    setErrorMsg(msg);
    setSuccessMsg(null);
  }

  async function handleSettingUpload(key: string, file: File) {
    setUploading(`logo_${key}`);
    try {
      const url = await uploadImage(`/api/media/settings/${key}`, file);
      setSettings((prev) => ({ ...prev, [key]: url }));
      const label = key === "site_logo" ? "School logo" : key === "hero_image" ? "Hero image" : key === "csi_logo" ? "CSI logo" : "Hearing logo";
      showSuccess(`${label} updated!`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleLeaderPhoto(leader: Leader, file: File) {
    setUploading(`leader_${leader.id}`);
    try {
      const url = await uploadImage(`/api/media/leadership/${leader.id}/photo`, file);
      setLeaders((prev) =>
        prev.map((l) => (l.id === leader.id ? { ...l, photo_url: url } : l))
      );
      showSuccess(`Photo updated for ${leader.full_name}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleFacilityImage(facility: Facility, file: File) {
    setUploading(`facility_${facility.id}`);
    try {
      const url = await uploadImage(`/api/media/facilities/${facility.id}/image`, file);
      setFacilities((prev) =>
        prev.map((f) => (f.id === facility.id ? { ...f, image_url: url } : f))
      );
      showSuccess(`Image updated for ${facility.name}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleProgramImage(program: Program, file: File) {
    setUploading(`program_${program.id}`);
    try {
      const url = await uploadImage(`/api/media/programs/${program.id}/image`, file);
      setPrograms((prev) =>
        prev.map((p) => (p.id === program.id ? { ...p, image_url: url } : p))
      );
      showSuccess(`Image updated for ${program.name}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  // ── Loading state ──

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-zinc-200 border-t-primary-500 dark:border-zinc-700 dark:border-t-hc-interactive rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
            Loading media manager…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl space-y-8 pb-12">
      {/* ── Toast notifications ── */}
      {successMsg && <Toast message={successMsg} type="success" />}
      {errorMsg && <Toast message={errorMsg} type="error" />}

      {/* ── Page Header ── */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-hc-interactive dark:to-hc-accent flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-hc-text tracking-tight">
              Media &amp; Images
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Upload and manage all images used across the website.
            </p>
          </div>
        </div>
      </div>

      {/* ── Site Logos (Bento Row) ── */}
      <section className="animate-slide-up bg-white dark:bg-hc-bg rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <SectionHeader
            icon={
              <svg className="w-5 h-5 text-violet-600 dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            }
            title="Site Logos"
            description="School logo appears in the header and hero section; CSI and Hearing logos appear in the hero section. Recommended: square PNG with transparent background."
            accentColor="bg-violet-100 dark:bg-hc-interactive"
          />
        </div>
        <div className="p-6 sm:p-8 pt-0 sm:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { key: "site_logo", label: "School Logo" },
              { key: "csi_logo", label: "CSI Diocese Logo" },
              { key: "hearing_logo", label: "Hearing Logo" },
            ].map((logo) => (
              <div
                key={logo.key}
                className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col items-center transition-all duration-200 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <ImageUploadCard
                  label={logo.label}
                  currentUrl={settings[logo.key] ?? ""}
                  shape="circle"
                  uploading={uploading === `logo_${logo.key}`}
                  onFileSelect={(f) => handleSettingUpload(logo.key, f)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero Background Image ── */}
      <section className="animate-slide-up bg-white dark:bg-hc-bg rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <SectionHeader
            icon={
              <svg className="w-5 h-5 text-sky-600 dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
            }
            title="Hero Background Image"
            description="Background image for the home page hero section. Recommended: wide image (e.g. 1920×1080). Leave empty to use the default pattern."
            accentColor="bg-sky-100 dark:bg-hc-interactive"
          />
        </div>
        <div className="p-6 sm:p-8 pt-0 sm:pt-0">
          <div className="max-w-md">
            <ImageUploadCard
              label="Hero image"
              currentUrl={settings.hero_image ?? ""}
              shape="square"
              uploading={uploading === "logo_hero_image"}
              onFileSelect={(f) => handleSettingUpload("hero_image", f)}
            />
          </div>
        </div>
      </section>

      {/* ── Leadership Photos ── */}
      <section className="animate-slide-up bg-white dark:bg-hc-bg rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <SectionHeader
            icon={
              <svg className="w-5 h-5 text-amber-600 dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            title="Leadership Photos"
            description="Shown on the About page. Recommended: square portrait, minimum 300×300 px."
            accentColor="bg-amber-100 dark:bg-hc-interactive"
          />
        </div>
        <div className="p-6 sm:p-8 pt-0 sm:pt-0">
          {leaders.length === 0 ? (
            <EmptyState message="No leadership profiles found." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col items-center transition-all duration-200 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <ImageUploadCard
                    label={`${leader.full_name}\n${leader.position_title}`}
                    currentUrl={leader.photo_url}
                    shape="circle"
                    uploading={uploading === `leader_${leader.id}`}
                    onFileSelect={(f) => handleLeaderPhoto(leader, f)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Facilities ── */}
      <section className="animate-slide-up bg-white dark:bg-hc-bg rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <SectionHeader
            icon={
              <svg className="w-5 h-5 text-emerald-600 dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            }
            title="Facilities Images"
            description="Shown on the About page facilities section. Recommended: landscape 600×400 px."
            accentColor="bg-emerald-100 dark:bg-hc-interactive"
          />
        </div>
        <div className="p-6 sm:p-8 pt-0 sm:pt-0">
          {facilities.length === 0 ? (
            <EmptyState message="No facilities found." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 transition-all duration-200 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <ImageUploadCard
                    label={facility.name}
                    currentUrl={facility.image_url}
                    shape="square"
                    uploading={uploading === `facility_${facility.id}`}
                    onFileSelect={(f) => handleFacilityImage(facility, f)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="animate-slide-up bg-white dark:bg-hc-bg rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <SectionHeader
            icon={
              <svg className="w-5 h-5 text-sky-600 dark:text-hc-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            }
            title="Programs Section Images"
            description="Shown on the Programs page. Recommended: landscape 800×500 px."
            accentColor="bg-sky-100 dark:bg-hc-interactive"
          />
        </div>
        <div className="p-6 sm:p-8 pt-0 sm:pt-0">
          {programs.length === 0 ? (
            <EmptyState message="No program categories found." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 transition-all duration-200 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <ImageUploadCard
                    label={program.name}
                    currentUrl={program.image_url}
                    shape="square"
                    uploading={uploading === `program_${program.id}`}
                    onFileSelect={(f) => handleProgramImage(program, f)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
