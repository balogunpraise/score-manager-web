"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import {
  getSchedules,
  deleteSchedule,
  ScheduleItem,
  DAYS_OF_WEEK,
} from "@/lib/api";
import AddScheduleModal from "@/app/components/schedule/AddScheduleModal";
import ScheduleDetailsDrawer from "@/app/components/schedule/ScheduleDetailsDrawer";
import ConflictCheckModal from "@/app/components/schedule/ConflictCheckModal";

const STATUS_LABELS = ["Active", "Cancelled", "Rescheduled"];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [semester, setSemester] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [drawerSchedule, setDrawerSchedule] = useState<ScheduleItem | null>(null);
  const [showConflictCheck, setShowConflictCheck] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSchedules({
        semester: semester || undefined,
        academicSession: academicSession || undefined,
        day: selectedDay !== "" ? selectedDay as number : undefined,
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSchedules(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }, [semester, academicSession, selectedDay]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this schedule?")) return;
    setActionLoading(id);
    try {
      const res = await deleteSchedule(id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      fetchSchedules();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule Management</h2>
            <p className="text-slate-400 text-sm">{schedules.length} schedules</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowConflictCheck(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Check Conflicts
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Schedule
            </button>
          </div>
        </div>

        <AddScheduleModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchSchedules()}
        />

        <ScheduleDetailsDrawer
          open={!!drawerSchedule}
          schedule={drawerSchedule}
          onClose={() => setDrawerSchedule(null)}
          onUpdate={() => fetchSchedules()}
        />

        <ConflictCheckModal
          open={showConflictCheck}
          onClose={() => setShowConflictCheck(false)}
        />

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="Semester (e.g., Fall 2024)"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
            />
          </div>
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="Academic Session (e.g., 2024/2025)"
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
            />
          </div>
          <div className="min-w-36">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
            >
              <option value="">All Days</option>
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchSchedules}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition"
          >
            Filter
          </button>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Course</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">Lecturer</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">Classroom</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Day & Time</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">Loading...</td></tr>
                ) : schedules.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No schedules found.</td></tr>
                ) : schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{s.courseCode}</p>
                        <p className="text-xs text-slate-500">{s.courseTitle}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">
                      <p className="font-medium">{s.lecturerName}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">
                      <p className="font-medium">{s.classroomName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{DAYS_OF_WEEK[s.day]}</p>
                        <p className="text-xs text-slate-500">
                          {formatTime(s.startTime)} - {formatTime(s.endTime)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        s.status === 0 ? "text-emerald-700 bg-emerald-50" :
                        s.status === 1 ? "text-red-700 bg-red-50" :
                        "text-amber-700 bg-amber-50"
                      }`}>
                        {STATUS_LABELS[s.status] || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDrawerSchedule(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="View details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={actionLoading === s.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                          title="Delete schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}