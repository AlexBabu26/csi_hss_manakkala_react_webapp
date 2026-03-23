export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">Loading…</p>
    </div>
  );
}
