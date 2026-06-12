"use client";

import { useState, useEffect } from "react";
import { ClassroomItem, getClassroomSchedule, updateClassroom, deleteClassroom, ClassroomScheduleItem, UpdateClassroomPayload } from "@/lib/api";

interface ClassroomDetailsDrawerProps {
  classroom: ClassroomItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const getTypeLabel = (type: number) => {
  const types = ["Lecture", "Lab", "Seminar", "Auditorium"];
  return types[type] || "Unknown";
};

const getDayName = (day: number) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day] || "Unknown";
};

export default function ClassroomDetailsDrawer({ classroom, open, onClose, onUpdate }: ClassroomDetailsDrawerProps) {
  const [schedule, setSchedule] = useState<ClassroomScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UpdateClassroomPayload>({
    isAvailable: true,
    name: "",
    building: "",
    capacity: 0,
    type: 0,
    hasProjector: false,
    hasWhiteboard: false,
    isAccessible: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (classroom) {
      setForm({
        isAvailable: classroom.isAvailable,
        name: classroom.name,
        building: classroom.building,
        capacity: parseInt(classroom.capacity),
        type: classroom.type,
        hasProjector: classroom.hasProjector,
        hasWhiteboard: false, // Not available in ClassroomItem
        isAccessible: false, // Not available in ClassroomItem
      });
      fetchSchedule();
    }
  }, [classroom]);

  const fetchSchedule = async () => {
    if (!classroom) return;
    setScheduleLoading(true);
    try {
      const res = await getClassroomSchedule(classroom.id);
      if (res.succeeded) {
        setSchedule(res.data);
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!classroom) return;
    setLoading(true);
    setError("");
    try {
      const res = await updateClassroom(classroom.id, form);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setIsEditing(false);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update classroom");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classroom || !confirm("Are you sure you want to delete this classroom?")) return;
    setLoading(true);
    try {
      const res = await deleteClassroom(classroom.id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      onUpdate();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete classroom");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      });
    } catch {
      return timeStr;
    }
  };

  if (!open || !classroom) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-end z-50">
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Classroom Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900">Basic Information</h4>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{classroom.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Building</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.building}
                    onChange={(e) => setForm({ ...form, building: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{classroom.building}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Capacity</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{classroom.capacity}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                {isEditing ? (
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option value={0}>Lecture</option>
                    <option value={1}>Lab</option>
                    <option value={2}>Seminar</option>
                    <option value={3}>Auditorium</option>
                  </select>
                ) : (
                  <p className="text-slate-800 font-medium">{getTypeLabel(classroom.type)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">Features</label>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Available</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.hasProjector}
                      onChange={(e) => setForm({ ...form, hasProjector: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Has Projector</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.hasWhiteboard}
                      onChange={(e) => setForm({ ...form, hasWhiteboard: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Has Whiteboard</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.isAccessible}
                      onChange={(e) => setForm({ ...form, isAccessible: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Wheelchair Accessible</span>
                  </label>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {classroom.isAvailable && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Available</span>
                  )}
                  {classroom.hasProjector && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Projector</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Schedule ({classroom.scheduleCount} classes)</h4>
            {scheduleLoading ? (
              <p className="text-sm text-slate-500">Loading schedule...</p>
            ) : schedule.length === 0 ? (
              <p className="text-sm text-slate-500">No classes scheduled</p>
            ) : (
              <div className="space-y-2">
                {schedule.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-slate-800 text-sm">{item.courseCode}</h5>
                      <span className="text-xs text-slate-500">{getDayName(item.day)}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{item.courseTitle}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.lecturerName}</span>
                      <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-medium text-red-600 mb-3">Danger Zone</h4>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 rounded-lg transition"
            >
              {loading ? "Deleting..." : "Delete Classroom"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}