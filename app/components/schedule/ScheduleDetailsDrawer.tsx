"use client";

import { useState, useEffect } from "react";
import { ScheduleItem, updateSchedule } from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const STATUS_LABELS = ["Active", "Cancelled", "Rescheduled"];

interface Props {
  open: boolean;
  schedule: ScheduleItem | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ScheduleDetailsDrawer({ open, schedule, onClose, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    status: 0,
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (schedule) {
      setForm({
        status: schedule.status,
        startTime: new Date(schedule.startTime).toTimeString().slice(0, 5),
        endTime: new Date(schedule.endTime).toTimeString().slice(0, 5),
      });
    }
  }, [schedule]);

  const handleUpdate = async () => {
    if (!schedule) return;
    setError("");
    setLoading(true);
    try {
      const res = await updateSchedule(schedule.id, {
        status: form.status,
        courseId: schedule.courseId,
        lecturerId: schedule.lecturerId,
        classroomId: schedule.classroomId,
        day: schedule.day,
        startTime: new Date(`1970-01-01T${form.startTime}:00Z`).toISOString(),
        endTime: new Date(`1970-01-01T${form.endTime}:00Z`).toISOString(),
        semester: schedule.semester,
        academicSession: schedule.academicSession,
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setEditing(false);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Schedule Details</h2>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"
                title="Edit schedule"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</label>
              <p className="text-slate-900 font-medium">{schedule.courseCode}</p>
              <p className="text-sm text-slate-500">{schedule.courseTitle}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecturer</label>
              <p className="text-slate-900 font-medium">{schedule.lecturerName}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classroom</label>
              <p className="text-slate-900 font-medium">{schedule.classroomName}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
              <p className="text-slate-900 font-medium">{DAYS[schedule.day]}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</label>
                {editing ? (
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">
                    {new Date(schedule.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
                {editing ? (
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">
                    {new Date(schedule.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              {editing ? (
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                >
                  {STATUS_LABELS.map((status, index) => (
                    <option key={index} value={index}>{status}</option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                  schedule.status === 0 ? "text-emerald-700 bg-emerald-50" :
                  schedule.status === 1 ? "text-red-700 bg-red-50" :
                  "text-amber-700 bg-amber-50"
                }`}>
                  {STATUS_LABELS[schedule.status] || "Unknown"}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester</label>
              <p className="text-slate-900 font-medium">{schedule.semester}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Session</label>
              <p className="text-slate-900 font-medium">{schedule.academicSession}</p>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        {editing && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => { setEditing(false); setError(""); }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}