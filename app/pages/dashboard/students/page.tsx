"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { getStudents, StudentItem } from "@/lib/api";
import AddStudentModal from "@/app/components/student/AddStudentModal";

const avatarGrad = (id: string) => {
  const grads = [
    "from-indigo-400 to-indigo-600",
    "from-pink-400 to-rose-500",
    "from-teal-400 to-cyan-500",
    "from-orange-400 to-amber-500",
    "from-green-400 to-emerald-500",
    "from-sky-400 to-blue-500",
  ];
  const idx = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return grads[idx % grads.length];
};

const initials = (s: StudentItem) =>
  `${s.firstName?.[0] ?? ""}${s.lastName?.[0] ?? ""}`.toUpperCase();

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState<{ field: string; order: "asc" | "desc" } | null>(null);

  const fetchStudents = useCallback(async (
    searchTerm = "",
    page = 1,
    sortField?: string,
    sortOrder?: "asc" | "desc"
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await getStudents({
        PageSize: PAGE_SIZE,
        PageNumber: page,
        SearchTerm: searchTerm || undefined,
        ...(sortField && { "Sort.SortValue": sortField, "Sort.SortOrder": sortOrder }),
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setStudents(res.data.items);
      setTotalCount(res.data.totalCount);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = (field: string) => {
    const next = sort?.field === field && sort.order === "asc" ? "desc" : "asc";
    setSort({ field, order: next });
    fetchStudents(search, 1, field, next);
  };

  const SortIcon = ({ field }: { field: string }) => {
    const active = sort?.field === field;
    return (
      <span className="inline-flex flex-col ml-1 opacity-40">
        <svg className={`w-2.5 h-2.5 -mb-0.5 ${active && sort?.order === "asc" ? "opacity-100 text-indigo-600" : ""}`} viewBox="0 0 10 6" fill="currentColor">
          <path d="M5 0L10 6H0z" />
        </svg>
        <svg className={`w-2.5 h-2.5 ${active && sort?.order === "desc" ? "opacity-100 text-indigo-600" : ""}`} viewBox="0 0 10 6" fill="currentColor">
          <path d="M5 6L0 0h10z" />
        </svg>
      </span>
    );
  };

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Students</h2>
            <p className="text-slate-400 text-sm">{totalCount} enrolled students</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </button>
        </div>

        <AddStudentModal open={showModal} onClose={() => setShowModal(false)} onSuccess={() => fetchStudents(search, currentPage, sort?.field, sort?.order)} />

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); fetchStudents(e.target.value, 1, sort?.field, sort?.order); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          />
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th onClick={() => handleSort("firstName")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5 cursor-pointer select-none hover:text-slate-600">
                    Student <SortIcon field="firstName" />
                  </th>
                  <th onClick={() => handleSort("studentNumber")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell cursor-pointer select-none hover:text-slate-600">
                    Student No. <SortIcon field="studentNumber" />
                  </th>
                  <th onClick={() => handleSort("department")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell cursor-pointer select-none hover:text-slate-600">
                    Department <SortIcon field="department" />
                  </th>
                  <th onClick={() => handleSort("level")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell cursor-pointer select-none hover:text-slate-600">
                    Level <SortIcon field="level" />
                  </th>
                  <th onClick={() => handleSort("gpa")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 cursor-pointer select-none hover:text-slate-600">
                    GPA <SortIcon field="gpa" />
                  </th>
                  <th onClick={() => handleSort("status")} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell cursor-pointer select-none hover:text-slate-600">
                    Status <SortIcon field="status" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No students found.</td></tr>
                ) : students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrad(s.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {initials(s)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">{s.studentNumber}</td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">{s.department}</td>
                    <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">{s.level}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{s.gpa}</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.status?.toLowerCase() === "active" ? "text-emerald-700 bg-emerald-50" : "text-slate-500 bg-slate-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status?.toLowerCase() === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {s.status}
                      </span>
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
                onClick={() => fetchStudents(search, currentPage - 1, sort?.field, sort?.order)}
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
                      onClick={() => fetchStudents(search, p as number, sort?.field, sort?.order)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === p ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => fetchStudents(search, currentPage + 1, sort?.field, sort?.order)}
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
