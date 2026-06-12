"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import {
  getLecturers,
  deleteLecturer,
  toggleLecturerAvailability,
  LecturerItem,
} from "@/lib/api";
import AddLecturerModal from "@/app/components/lecturer/AddLecturerModal";
import AllocateCoursesModal from "@/app/components/lecturer/AllocateCoursesModal";
import LecturerCoursesDrawer from "@/app/components/lecturer/LecturerCoursesDrawer";

const RANK_LABELS = ["Graduate Asst.", "Asst. Lecturer", "Lecturer", "Senior Lecturer", "Assoc. Professor", "Professor"];
const SPEC_LABELS = ["Art", "Business", "Science", "Social Sciences", "Engineering", "IT", "Humanities", "Medicine", "Mathematics"];
const PAGE_SIZE = 10;

const avatarGrad = (id: string) => {
  const grads = ["from-indigo-400 to-indigo-600", "from-pink-400 to-rose-500", "from-teal-400 to-cyan-500", "from-orange-400 to-amber-500", "from-green-400 to-emerald-500", "from-sky-400 to-blue-500"];
  return grads[(id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % grads.length];
};

const initials = (l: LecturerItem) => `${l.firstName?.[0] ?? ""}${l.lastName?.[0] ?? ""}`.toUpperCase();

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState<{ field: string; order: "asc" | "desc" } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [allocateLecturer, setAllocateLecturer] = useState<LecturerItem | null>(null);
  const [drawerLecturer, setDrawerLecturer] = useState<LecturerItem | null>(null);

  const fetchLecturers = useCallback(async (
    searchTerm = "", page = 1, sortField?: string, sortOrder?: "asc" | "desc"
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await getLecturers({
        PageSize: PAGE_SIZE,
        PageNumber: page,
        SearchTerm: searchTerm || undefined,
        ...(sortField && { "Sort.SortValue": sortField, "Sort.SortOrder": sortOrder }),
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setLecturers(res.data.items);
      setTotalCount(Number(res.data.totalCount));
      setCurrentPage(Number(res.data.currentPage));
      setTotalPages(Number(res.data.totalPages));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lecturers");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = (field: string) => {
    const next = sort?.field === field && sort.order === "asc" ? "desc" : "asc";
    setSort({ field, order: next });
    fetchLecturers(search, 1, field, next);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lecturer?")) return;
    setActionLoading(id);
    try {
      const res = await deleteLecturer(id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      fetchLecturers(search, currentPage, sort?.field, sort?.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (id: string) => {
    setActionLoading(id + "-toggle");
    try {
      const res = await toggleLecturerAvailability(id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      fetchLecturers(search, currentPage, sort?.field, sort?.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setActionLoading(null);
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    const active = sort?.field === field;
    return (
      <span className="inline-flex flex-col ml-1 opacity-40">
        <svg className={`w-2.5 h-2.5 -mb-0.5 ${active && sort?.order === "asc" ? "opacity-100 text-indigo-600" : ""}`} viewBox="0 0 10 6" fill="currentColor"><path d="M5 0L10 6H0z" /></svg>
        <svg className={`w-2.5 h-2.5 ${active && sort?.order === "desc" ? "opacity-100 text-indigo-600" : ""}`} viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0h10z" /></svg>
      </span>
    );
  };

  useEffect(() => { fetchLecturers(); }, [fetchLecturers]);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lecturers</h2>
            <p className="text-slate-400 text-sm">{totalCount} lecturers</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lecturer
          </button>
        </div>

        <AddLecturerModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchLecturers(search, currentPage, sort?.field, sort?.order)}
        />

        <AllocateCoursesModal
          open={!!allocateLecturer}
          lecturerId={allocateLecturer?.id ?? ""}
          lecturerName={allocateLecturer?.fullName || `${allocateLecturer?.firstName ?? ""} ${allocateLecturer?.lastName ?? ""}`}
          onClose={() => setAllocateLecturer(null)}
          onSuccess={() => fetchLecturers(search, currentPage, sort?.field, sort?.order)}
        />

        <LecturerCoursesDrawer
          open={!!drawerLecturer}
          lecturerId={drawerLecturer?.id ?? ""}
          lecturerName={drawerLecturer?.fullName || `${drawerLecturer?.firstName ?? ""} ${drawerLecturer?.lastName ?? ""}`}
          onClose={() => setDrawerLecturer(null)}
        />

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search lecturers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); fetchLecturers(e.target.value, 1, sort?.field, sort?.order); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          />
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th onClick={() => handleSort("firstName")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5 cursor-pointer select-none hover:text-slate-600">
                    Lecturer <SortIcon field="firstName" />
                  </th>
                  <th onClick={() => handleSort("rank")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell cursor-pointer select-none hover:text-slate-600">
                    Rank <SortIcon field="rank" />
                  </th>
                  <th onClick={() => handleSort("specialization")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell cursor-pointer select-none hover:text-slate-600">
                    Specialization <SortIcon field="specialization" />
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">
                    Availability
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">
                    Courses
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">Loading...</td></tr>
                ) : lecturers.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No lecturers found.</td></tr>
                ) : lecturers.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrad(l.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {initials(l)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{l.fullName || `${l.firstName} ${l.lastName}`}</p>
                          <p className="text-xs text-slate-400">{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">{RANK_LABELS[l.rank] ?? l.rank}</td>
                    <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">{SPEC_LABELS[l.specialization] ?? l.specialization}</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <button
                        onClick={() => handleToggle(l.id)}
                        disabled={actionLoading === l.id + "-toggle"}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition ${l.isAvailable ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : "text-slate-500 bg-slate-100 hover:bg-slate-200"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${l.isAvailable ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {l.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAllocateLecturer(l)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                          title="Allocate courses"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Allocate
                        </button>
                        <button
                          onClick={() => setDrawerLecturer(l)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                          title="View allocated courses"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {l.allocatedCoursesCount ?? ""}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(l.id)}
                        disabled={actionLoading === l.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                        title="Delete lecturer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400">
              Page {currentPage} of {totalPages} &mdash; {totalCount} total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchLecturers(search, currentPage - 1, sort?.field, sort?.order)}
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
                    <span key={`e-${i}`} className="px-1 text-slate-300 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => fetchLecturers(search, p as number, sort?.field, sort?.order)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === p ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => fetchLecturers(search, currentPage + 1, sort?.field, sort?.order)}
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
    </DashboardLayout>
  );
}
