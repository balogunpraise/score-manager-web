"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { createCourse, getCourses, CourseItem } from "@/lib/api";

type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  creditHours: number;
  color: string;
};

const colorMap: Record<string, { gradient: string; badge: string; bar: string }> = {
  indigo: { gradient: "from-indigo-500 to-violet-600", badge: "bg-indigo-50 text-indigo-700", bar: "bg-indigo-500" },
  violet: { gradient: "from-violet-500 to-purple-600", badge: "bg-violet-50 text-violet-700", bar: "bg-violet-500" },
  amber: { gradient: "from-amber-400 to-orange-500", badge: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  cyan: { gradient: "from-cyan-400 to-sky-500", badge: "bg-cyan-50 text-cyan-700", bar: "bg-cyan-500" },
  emerald: { gradient: "from-emerald-400 to-teal-500", badge: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
  pink: { gradient: "from-pink-400 to-rose-500", badge: "bg-pink-50 text-pink-700", bar: "bg-pink-500" },
};

const colors = Object.keys(colorMap);
const empty: Omit<Course, "id"> = { name: "", code: "", description: "", creditHours: 0, color: "indigo" };

function toUiCourse(item: CourseItem, index: number): Course {
  return {
    id: item.id,
    name: item.title,
    code: item.courseCode,
    description: item.description,
    creditHours: item.creditHours,
    color: colors[index % colors.length],
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<Omit<Course, "id">>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 9;

  const fetchCourses = useCallback(async (searchTerm = "", page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await getCourses({ PageSize: PAGE_SIZE, PageNumber: page, SearchTerm: searchTerm || undefined });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setCourses(res.data.items.map(toUiCourse));
      setTotalCount(res.data.totalCount);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c: Course) => { setEditing(c); setForm(c); setModal(true); };

  const save = async () => {
    if (editing) {
      setCourses((prev) => prev.map((c) => (c.id === editing.id ? { ...form, id: editing.id } : c)));
    } else {
      await createCourse({
        courseCode: form.code,
        title: form.name,
        description: form.description,
        creditHours: form.creditHours,
      });
      await fetchCourses(search, currentPage);
    }
    setModal(false);
  };

  const remove = (id: string) => { setCourses((prev) => prev.filter((c) => c.id !== id)); setDeleteId(null); };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Courses</h2>
            <p className="text-slate-400 text-sm">{totalCount} courses available</p>
          </div>
          <button
            onClick={openAdd}
            className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Course
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); fetchCourses(e.target.value, 1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          />
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 py-16 text-center text-slate-400 text-sm">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-slate-400 text-sm">No courses found.</div>
          ) : courses.map((c) => {
            const cm = colorMap[c.color] ?? colorMap.indigo;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${cm.gradient}`} />
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                      <h3 className="font-bold text-slate-900 mt-2 leading-tight">{c.name}</h3>
                      {c.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{c.description}</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="font-bold text-slate-900">{c.creditHours}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Credit Hours</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400">
              Page {currentPage} of {totalPages} &mdash; {totalCount} total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchCourses(search, currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-slate-300 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => fetchCourses(search, p as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        currentPage === p
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => fetchCourses(search, currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Course" : "Add Course"}</h3>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                <input className="mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Course title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Code</label>
                <input className="mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CS-101" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                <input className="mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credit Hours</label>
                <input type="number" min={0} className="mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  value={form.creditHours} onChange={(e) => setForm({ ...form, creditHours: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Color</label>
                <div className="flex gap-2">
                  {colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setForm({ ...form, color: col })}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${colorMap[col].gradient} transition ring-2 ring-offset-2 ${form.color === col ? "ring-slate-400" : "ring-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition active:scale-95">
                {editing ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900">Delete course?</h3>
              <p className="text-sm text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
