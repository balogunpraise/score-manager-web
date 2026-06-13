"use client";

import { useState } from "react";
import { checkScheduleConflicts, getAvailableClassrooms, DAYS_OF_WEEK } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY = {
  lecturerId: "",
  classroomId: "",
  day: 0,
  startTime: "",
  endTime: "",
};

export default function ConflictCheckModal({ open, onClose }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [conflicts, setConflicts] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!form.lecturerId || !form.classroomId || !form.startTime || !form.endTime) {
      setError("Please fill all fields");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const [conflictRes, roomsRes] = await Promise.all([
        checkScheduleConflicts({
          ...form,
          startTime: `${form.startTime}:00`,
          endTime: `${form.endTime}:00`,
        }),
        getAvailableClassrooms({
          day: form.day,
          startTime: `${form.startTime}:00`,
          endTime: `${form.endTime}:00`,
        }),
      ]);
      
      setConflicts(conflictRes);
      setAvailableRooms(roomsRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setConflicts(null);
    setAvailableRooms([]);
    setError("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Check Schedule Conflicts</h2>
          <button onClick={() => { onClose(); reset(); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Time Slot Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecturer ID</label>
                <input
                  type="text"
                  placeholder="Enter lecturer ID"
                  value={form.lecturerId}
                  onChange={(e) => setForm({ ...form, lecturerId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50/50 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classroom ID</label>
                <input
                  type="text"
                  placeholder="Enter classroom ID"
                  value={form.classroomId}
                  onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50/50 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50/50 transition"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50/50 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50/50 transition"
                />
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {loading ? "Checking…" : "Check for Conflicts"}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {/* Conflict Results */}
          {conflicts && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Conflict Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border-2 ${conflicts.isValid ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {conflicts.isValid ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`font-semibold ${conflicts.isValid ? "text-emerald-800" : "text-red-800"}`}>
                      {conflicts.isValid ? "Valid Schedule" : "Conflicts Found"}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Lecturer Conflict:</span>
                      <span className={conflicts.hasLecturerConflict ? "text-red-600" : "text-emerald-600"}>
                        {conflicts.hasLecturerConflict ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Classroom Conflict:</span>
                      <span className={conflicts.hasClassroomConflict ? "text-red-600" : "text-emerald-600"}>
                        {conflicts.hasClassroomConflict ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Availability Issue:</span>
                      <span className={conflicts.hasAvailabilityIssue ? "text-red-600" : "text-emerald-600"}>
                        {conflicts.hasAvailabilityIssue ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 mb-2">Conflict Details</h4>
                  {conflicts.conflicts?.length > 0 ? (
                    <ul className="text-sm text-slate-600 space-y-1">
                      {conflicts.conflicts.map((conflict: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          {conflict}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No specific conflicts detected</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Available Classrooms */}
          {availableRooms.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Available Classrooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRooms.map((room) => (
                  <div key={room.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">{room.name}</span>
                      <span className="text-xs text-slate-500">{room.capacity} seats</span>
                    </div>
                    <p className="text-sm text-slate-600">{room.building}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className={`inline-flex items-center gap-1 ${room.hasProjector ? "text-emerald-600" : "text-slate-400"}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Projector
                      </span>
                      <span className="text-slate-500">{room.scheduleCount} schedules</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Reset
          </button>
          <button
            onClick={() => { onClose(); reset(); }}
            className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}