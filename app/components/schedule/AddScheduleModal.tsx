"use client";

import { useState, useEffect } from "react";
import {
  createSchedule,
  getCourses,
  getLecturers,
  getClassrooms,
  getAcademicSessions,
  CourseItem,
  LecturerItem,
  ClassroomItem,
  AcademicSession,
  DAYS_OF_WEEK,
} from "@/lib/api";

const SEMESTERS = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "First & Second", value: 3 },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY = {
  courseId: "",
  lecturerId: "",
  classroomId: "",
  day: 0,
  startTime: "",
  endTime: "",
  semester: "",
  academicSessionId: "",
  academicSession: "",
};

export default function AddScheduleModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    Promise.all([
      getCourses({ PageSize: 100 }).then((r) => setCourses(r.data?.items ?? [])),
      getLecturers({ PageSize: 100 }).then((r) => setLecturers(r.data?.items ?? [])),
      getClassrooms().then((r) => setClassrooms(r.data ?? [])),
      getAcademicSessions().then((r) => { if (r.succeeded) setSessions(r.data); }),
    ]);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createSchedule({
        courseId: form.courseId,
        lecturerId: form.lecturerId,
        classroomId: form.classroomId,
        day: form.day,
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        semester: form.semester !== "" ? Number(form.semester) : undefined,
        academicSessionId: form.academicSessionId || undefined,
        academicSession: form.academicSession || undefined,
      });
      if (!res.succeeded) {
        const msg = res.errors?.find(Boolean) || res.message || "Failed to create schedule";
        throw new Error(msg);
      }
      setForm(EMPTY);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Add Schedule</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</label>
              <select
                required
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseCode} - {c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecturer</label>
              <select
                required
                value={form.lecturerId}
                onChange={(e) => setForm({ ...form, lecturerId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select Lecturer</option>
                {lecturers.filter(l => l.isAvailable).map((l) => (
                  <option key={l.id} value={l.id}>{l.fullName || `${l.firstName} ${l.lastName}`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classroom</label>
              <select
                required
                value={form.classroomId}
                onChange={(e) => setForm((f) => ({ ...f, classroomId: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select Classroom</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.building}) - {c.capacity} seats</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
              <select
                required
                value={form.day}
                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              />
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester <span className="text-slate-300">(optional)</span></label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Session <span className="text-slate-300">(optional)</span></label>
              <select
                value={form.academicSessionId}
                onChange={(e) => {
                  const selected = sessions.find((s) => s.id === e.target.value);
                  setForm({ ...form, academicSessionId: e.target.value, academicSession: selected?.sessionCode ?? "" });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
              >
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>{s.sessionCode}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60">
            {loading ? "Creating…" : "Create Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}