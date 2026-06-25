"use client";

import { useState, useEffect } from "react";
import {
  getAllocatedCourses,
  getLecturers,
  removeCoursesFromLecturer,
  reassignCourse,
  AllocatedCourse,
  LecturerItem,
} from "@/lib/api";

const QUAL_LABELS = ["Bachelor", "Master", "Doctorate"];
const SPEC_LABELS = ["Art", "Business", "Science", "Social Sciences"];

interface Props {
  open: boolean;
  lecturerId: string;
  lecturerName: string;
  onClose: () => void;
}

export default function LecturerCoursesDrawer({ open, lecturerId, lecturerName, onClose }: Props) {
  const [courses, setCourses] = useState<AllocatedCourse[]>([]);
  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reassignTarget, setReassignTarget] = useState<AllocatedCourse | null>(null);
  const [toLecturerId, setToLecturerId] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllocatedCourses(lecturerId);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setCourses(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) { setSelected([]); setReassignTarget(null); return; }
    fetchCourses();
    getLecturers({ PageSize: 200 }).then((r) => setLecturers(r.data?.items ?? []));
  }, [open, lecturerId]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleRemove = async () => {
    if (!selected.length) return;
    setActionLoading("remove");
    try {
      const res = await removeCoursesFromLecturer(lecturerId, selected);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSelected([]);
      fetchCourses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReassign = async () => {
    if (!reassignTarget || !toLecturerId) return;
    setActionLoading("reassign");
    try {
      const res = await reassignCourse(lecturerId, toLecturerId, reassignTarget.courseId);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setReassignTarget(null);
      setToLecturerId("");
      fetchCourses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reassign failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">Allocated Courses</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lecturerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 border-b border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 flex-1">{selected.length} selected</p>
            <button
              onClick={handleRemove}
              disabled={actionLoading === "remove"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {actionLoading === "remove" ? "Removing…" : "Remove"}
            </button>
            <button onClick={() => setSelected([])} className="text-xs text-slate-500 hover:text-slate-700 transition">
              Clear
            </button>
          </div>
        )}

        {/* Error */}
        {error && <p className="mx-6 mt-3 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Course list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-12">Loading...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No courses allocated yet.</p>
            </div>
          ) : courses.map((c) => {
            const isSelected = selected.includes(c.courseId);
            return (
              <div
                key={c.courseId}
                className={`rounded-xl border p-4 transition ${isSelected ? "border-indigo-200 bg-indigo-50" : "border-slate-100 bg-white"}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSelect(c.courseId)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 hover:border-slate-400"}`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                        <p className="text-xs text-slate-400">{c.courseCode} · {c.level ?? "—"}</p>
                      </div>
                      <button
                        onClick={() => { setReassignTarget(c); setToLecturerId(""); }}
                        className="shrink-0 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition"
                        title="Reassign"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Reassign
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.department && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{c.department}</span>}
                      {c.isElective && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Elective</span>}
                      {c.isGeneralStudies && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Gen. Studies</span>}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{c.creditHours} cr.</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassign modal */}
      {reassignTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Reassign Course</h3>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-slate-800">{reassignTarget.title}</p>
              <p className="text-xs text-slate-400">{reassignTarget.courseCode}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assign To</label>
              <select
                value={toLecturerId}
                onChange={(e) => setToLecturerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select lecturer…</option>
                {lecturers
                  .filter((l) => l.id !== lecturerId)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName || `${l.firstName} ${l.lastName}`}
                    </option>
                  ))}
              </select>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => { setReassignTarget(null); setError(""); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={!toLecturerId || actionLoading === "reassign"}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {actionLoading === "reassign" ? "Reassigning…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
