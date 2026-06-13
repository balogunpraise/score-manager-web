"use client";

import { useState, useEffect } from "react";
import {
  getClassroomScheduleByDay,
  getAvailableClassrooms,
  ScheduleItem,
  AvailableClassroom,
  DAYS_OF_WEEK,
} from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClassroomAvailabilityModal({ open, onClose }: Props) {
  const [classroomSchedules, setClassroomSchedules] = useState<ScheduleItem[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableClassroom[]>([]);
  const [classroomId, setClassroomId] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"schedule" | "available">("schedule");

  const fetchClassroomSchedule = async () => {
    if (!classroomId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getClassroomScheduleByDay(classroomId, {
        day: selectedDay,
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setClassroomSchedules(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load classroom schedule");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    if (!startTime || !endTime) {
      setError("Please enter start and end times");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getAvailableClassrooms({
        day: selectedDay,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
      });
      setAvailableRooms(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load available classrooms");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Classroom Availability</h2>
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
            Classroom Schedule
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === "available"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Find Available Rooms
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "schedule" ? (
            <div className="space-y-4">
              {/* Classroom Schedule Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classroom ID</label>
                  <input
                    type="text"
                    placeholder="Enter classroom ID"
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
                  >
                    {DAYS_OF_WEEK.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={fetchClassroomSchedule}
                disabled={!classroomId}
                className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Load Classroom Schedule
              </button>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              {/* Schedule List */}
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center text-slate-400 text-sm py-8">Loading...</p>
                ) : classroomSchedules.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No schedules found for this classroom.</p>
                ) : (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">{DAYS_OF_WEEK[selectedDay]} Schedule</h3>
                    <div className="space-y-2">
                      {classroomSchedules.map((s) => (
                        <div key={s.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <div className="flex items-center justify-between mb-2">
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
                            <span>{s.lecturerName}</span>
                            <span>{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Available Rooms Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-slate-50/50 transition"
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
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-slate-50/50 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-slate-50/50 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Capacity</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-slate-50/50 transition"
                  />
                </div>
              </div>

              <button
                onClick={fetchAvailableRooms}
                className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
              >
                Find Available Classrooms
              </button>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              {/* Available Rooms */}
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center text-slate-400 text-sm py-8">Loading...</p>
                ) : availableRooms.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No available classrooms found.</p>
                ) : (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Available Classrooms ({availableRooms.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableRooms.map((room) => (
                        <div key={room.id} className={`p-4 rounded-xl border-2 ${
                          room.isAvailable ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-800">{room.name}</span>
                            <div className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${
                                room.isAvailable ? "bg-emerald-500" : "bg-slate-400"
                              }`} />
                              <span className={`text-xs font-semibold ${
                                room.isAvailable ? "text-emerald-700" : "text-slate-500"
                              }`}>
                                {room.isAvailable ? "Available" : "Busy"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                              <span>Building:</span>
                              <span className="font-medium">{room.building}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Capacity:</span>
                              <span className="font-medium">{room.capacity} seats</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Type:</span>
                              <span className="font-medium">
                                {room.type === 0 ? "Lecture" : 
                                 room.type === 1 ? "Lab" :
                                 room.type === 2 ? "Seminar" : "Auditorium"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200 text-xs">
                            <span className={`inline-flex items-center gap-1 ${
                              room.hasProjector ? "text-emerald-600" : "text-slate-400"
                            }`}>
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
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}