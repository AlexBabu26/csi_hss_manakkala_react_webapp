"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Program {
  id: number;
  category_id: number;
  title: string;
  description: string;
  image_url: string | null;
  alt_text: string;
  display_order: number;
}

interface Category {
  id: number;
  name: string;
  key: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  programs: Program[];
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

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

const inputClasses =
  "mt-1 block w-full px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-hc-interactive/30 dark:focus:border-hc-interactive text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all duration-200";

export default function ManagePrograms() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<
    { type: "category" | "program"; id: number } | null
  >(null);

  const loadPrograms = async () => {
    try {
      const res = await apiFetch("/api/media/programs");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        setCategories([]);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddCategory = async () => {
    try {
      const res = await apiFetch("/api/media/programs/category", {
        method: "POST",
        body: JSON.stringify({ name: "New Category", key: "new-category" }),
      });
      if (res.ok) {
        await loadPrograms();
      }
    } catch {
      // Handle error
    }
  };

  const updateCategoryLocal = (
    id: number,
    updater: (c: Category) => Category
  ) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? updater(c) : c))
    );
  };

  const handleSaveCategory = async (cat: Category) => {
    try {
      const res = await apiFetch(
        `/api/media/programs/category/${cat.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ name: cat.name, key: cat.key }),
        }
      );
      if (!res.ok) throw new Error("Failed to save category");
      await loadPrograms();
    } catch {
      // Handle error
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setDeleteConfirm(null);
    try {
      const res = await apiFetch(`/api/media/programs/category/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadPrograms();
      }
    } catch {
      // Handle error
    }
  };

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const reordered = [...categories];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, removed);
    const ids = reordered.map((c) => c.id);
    try {
      const res = await apiFetch("/api/media/programs/category/reorder", {
        method: "PUT",
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        setCategories(reordered);
      }
    } catch {
      // Handle error
    }
  };

  const handleAddProgram = async (categoryId: number) => {
    try {
      const res = await apiFetch("/api/media/programs/program", {
        method: "POST",
        body: JSON.stringify({
          category_id: categoryId,
          title: "New Program",
          description: "",
          alt_text: "",
        }),
      });
      if (res.ok) {
        await loadPrograms();
      }
    } catch {
      // Handle error
    }
  };

  const updateProgramLocal = (
    categoryId: number,
    programId: number,
    updater: (p: Program) => Program
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              programs: c.programs.map((p) =>
                p.id === programId ? updater(p) : p
              ),
            }
          : c
      )
    );
  };

  const handleSaveProgram = async (
    categoryId: number,
    prog: Program
  ) => {
    try {
      const res = await apiFetch(
        `/api/media/programs/program/${prog.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: prog.title,
            description: prog.description,
            alt_text: prog.alt_text,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to save program");
      await loadPrograms();
    } catch {
      // Handle error
    }
  };

  const handleDeleteProgram = async (id: number) => {
    setDeleteConfirm(null);
    try {
      const res = await apiFetch(`/api/media/programs/program/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadPrograms();
      }
    } catch {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[40vh]"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading programs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Manage Programs
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Organize categories and their programs
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <PlusIcon />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-12 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            No categories yet. Click &quot;Add Category&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 px-6 py-4">
                <button
                  type="button"
                  onClick={() => toggleExpand(cat.id)}
                  className="text-zinc-400 hover:text-primary-600 dark:text-zinc-500 dark:hover:text-hc-interactive transition-colors duration-200 shrink-0"
                  aria-expanded={expandedIds.has(cat.id)}
                >
                  <ChevronIcon expanded={expandedIds.has(cat.id)} />
                </button>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleExpand(cat.id)}
                >
                  {!expandedIds.has(cat.id) && (
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-900 dark:text-white font-semibold">
                        {cat.name || cat.key || "Untitled"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 font-medium">
                        {(cat.programs ?? []).length} program{(cat.programs ?? []).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {expandedIds.has(cat.id) && (
                    <span className="text-sm font-medium text-primary-600 dark:text-hc-interactive">
                      Editing Category
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveCategory(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    title="Move up"
                  >
                    <ArrowUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCategory(index, 1)}
                    disabled={index === categories.length - 1}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    title="Move down"
                  >
                    <ArrowDownIcon />
                  </button>

                  {expandedIds.has(cat.id) && (
                    <>
                      <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                      <button
                        type="button"
                        onClick={() => handleSaveCategory(cat)}
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl transition-all duration-200"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({ type: "category", id: cat.id })
                        }
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        title="Delete category"
                      >
                        <TrashIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Category Expanded Content */}
              {expandedIds.has(cat.id) && (
                <div className="px-6 pb-6">
                  {/* Category Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pl-8">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          updateCategoryLocal(cat.id, (c) => ({
                            ...c,
                            name: e.target.value,
                          }))
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                        Category Key
                      </label>
                      <input
                        type="text"
                        value={cat.key}
                        onChange={(e) =>
                          updateCategoryLocal(cat.id, (c) => ({
                            ...c,
                            key: e.target.value,
                          }))
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Programs Section */}
                  <div className="border-t border-zinc-100 dark:border-zinc-700/50 pt-5 pl-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
                        Programs
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleAddProgram(cat.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-primary-700 dark:text-hc-interactive bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 rounded-xl transition-all duration-200"
                      >
                        <PlusIcon />
                        Add Program
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(cat.programs ?? []).map((prog) => (
                        <div
                          key={prog.id}
                          className="p-5 bg-zinc-50/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-200"
                        >
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                              Title
                            </label>
                            <input
                              type="text"
                              value={prog.title}
                              onChange={(e) =>
                                updateProgramLocal(cat.id, prog.id, (p) => ({
                                  ...p,
                                  title: e.target.value,
                                }))
                              }
                              className={inputClasses}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={prog.description}
                              onChange={(e) =>
                                updateProgramLocal(cat.id, prog.id, (p) => ({
                                  ...p,
                                  description: e.target.value,
                                }))
                              }
                              className={inputClasses}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-0.5">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={prog.alt_text}
                              onChange={(e) =>
                                updateProgramLocal(cat.id, prog.id, (p) => ({
                                  ...p,
                                  alt_text: e.target.value,
                                }))
                              }
                              className={inputClasses}
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveProgram(cat.id, prog)}
                              className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-hc-interactive dark:to-hc-interactive dark:hover:from-hc-accent dark:hover:to-hc-accent dark:text-hc-bg rounded-xl transition-all duration-200"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({ type: "program", id: prog.id })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                            >
                              <TrashIcon />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                      {(cat.programs ?? []).length === 0 && (
                        <div className="text-center py-8 text-sm text-zinc-400 dark:text-zinc-500">
                          No programs in this category yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 p-6 shadow-xl mx-4 max-w-md w-full animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2
                  id="delete-confirm-title"
                  className="text-lg font-semibold text-zinc-900 dark:text-white"
                >
                  {deleteConfirm.type === "category"
                    ? "Delete Category"
                    : "Delete Program"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {deleteConfirm.type === "category"
                    ? "This will permanently delete this category and all its programs. This action cannot be undone."
                    : "This will permanently delete this program. This action cannot be undone."}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteConfirm.type === "category"
                    ? handleDeleteCategory(deleteConfirm.id)
                    : handleDeleteProgram(deleteConfirm.id)
                }
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
