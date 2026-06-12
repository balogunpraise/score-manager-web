"use client";

import { useState, useEffect } from "react";
import {
  getLecturerSchedule,
  getLecturerAvailableSlots,
  ScheduleItem,
  LecturerSlot,
} from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props {
  open: boolean;
  lecturerId: string;
  lecturerName: string;
  onClose: () => void;
}

export default function LecturerScheduleDrawer({ open, lecturerId, lecturerName, onClose }: Props) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [availableSlots, setAvailableSlots] = useState<LecturerSlot[]>([]);
  const [semester, setSemester] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [duration, setDuration] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"schedule" | "slots">("schedule");

  useEffect(() => {
    if (!open || !lecturerId) return;
    fetchSchedule();
  }, [open, lecturerId, semester, academicSession]);

  const fetchSchedule = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLecturerSchedule(lecturerId, {
        semester: semester || undefined,
        academicSession: academicSession || undefined,
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSchedules(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!lecturerId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getLecturerAvailableSlots(lecturerId, {
        day: selectedDay,
        durationMinutes: duration,
      });
      setAvailableSlots(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load available slots");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">Lecturer Schedule</h2>
            <p className="text-sm text-slate-500">{lecturerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === "schedule"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Current Schedule
          </button>
          <button
            onClick={() => { setActiveTab("slots"); fetchAvailableSlots(); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === "slots"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Available Slots
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "schedule" ? (
            <div className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Semester (e.g., Fall 2024)"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Academic Session (e.g., 2024/2025)"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                </div>
                <button
                  onClick={fetchSchedule}
                  className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
                >
                  Filter Schedule
                </button>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              {/* Schedule List */}
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center text-slate-400 text-sm py-8">Loading...</p>
                ) : schedules.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No schedules found.</p>
                ) : (
                  schedules.map((s) => (
                    <div key={s.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{s.courseCode}</p>
                          <p className="text-xs text-slate-500">{s.courseTitle}</p>
                        </div>
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                          s.status === 0 ? "text-emerald-700 bg-emerald-50" :
                          s.status === 1 ? "text-red-700 bg-red-50" :
                          "text-amber-700 bg-amber-50"
                        }`}>
                          {s.status === 0 ? "Active" : s.status === 1 ? "Cancelled" : "Rescheduled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{DAYS[s.day]}</span>
                        <span>{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{s.classroomName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Slot Filters */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration (minutes)</label>
                  <input
                    type="number"
                    min="30"
                    step="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                </div>
                <button
                  onClick={fetchAvailableSlots}
                  className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
                >
                  Find Available Slots
                </button>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              {/* Available Slots */}
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center text-slate-400 text-sm py-8">Loading...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No available slots found.</p>
                ) : (
                  availableSlots.map((slot, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      slot.isAvailable ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            slot.isAvailable ? "bg-emerald-500" : "bg-slate-400"
                          }`} />
                          <span className="text-sm font-medium text-slate-800">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold ${
                          slot.isAvailable ? "text-emerald-700" : "text-slate-500"
                        }`}>
                          {slot.isAvailable ? "Available" : "Busy"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{DAYS[selectedDay]}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}