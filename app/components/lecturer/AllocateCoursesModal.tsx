"use client";

import { useState, useEffect } from "react";
import { getCourses, manualAllocateCourses, CourseItem } from "@/lib/api";

interface Props {
  open: boolean;
  lecturerId: string;
  lecturerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AllocateCoursesModal({ open, lecturerId, lecturerName, onClose, onSuccess }: Props) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelected([]);
    setSearch("");
    getCourses({ PageSize: 200 }).then((r) => setCourses(r.data?.items ?? []));
  }, [open]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSubmit = async () => {
    if (!selected.length) return;
    setError("");
    setLoading(true);
    try {
      const res = await manualAllocateCourses(lecturerId, selected);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Allocation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">Allocate Courses</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lecturerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
            />
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-indigo-600 font-medium mt-2">{selected.length} course{selected.length > 1 ? "s" : ""} selected</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1.5">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No courses found.</p>
          ) : filtered.map((c) => {
            const checked = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${checked ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.courseCode}</p>
                </div>
              </button>
            );
          })}
        </div>

        {error && <p className="mx-6 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selected.length === 0}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Allocating…" : `Allocate ${selected.length > 0 ? `(${selected.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
