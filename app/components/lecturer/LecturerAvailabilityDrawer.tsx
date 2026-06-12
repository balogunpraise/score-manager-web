"use client";

import { useState, useEffect } from "react";
import {
  getLecturerAvailabilityByDay,
  getLecturerAvailabilityById,
  createLecturerAvailability,
  batchCreateLecturerAvailability,
  updateLecturerAvailability,
  deleteLecturerAvailability,
  deleteLecturerAvailabilityByDay,
  LecturerAvailabilityItem,
} from "@/lib/api";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  open: boolean;
  lecturerId: string;
  lecturerName: string;
  onClose: () => void;
}

const EMPTY_FORM = { day: 0, startTime: "", endTime: "", isAvailable: true };
const EMPTY_BATCH = { days: [] as number[], startTime: "", endTime: "" };

export default function LecturerAvailabilityDrawer({ open, lecturerId, lecturerName, onClose }: Props) {
  const [slots, setSlots] = useState<LecturerAvailabilityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterDay, setFilterDay] = useState<number | undefined>(undefined);

  // Add single
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);

  // Edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  // Batch add
  const [showBatch, setShowBatch] = useState(false);
  const [batchForm, setBatchForm] = useState(EMPTY_BATCH);

  const fetchSlots = async (day?: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await getLecturerAvailabilityByDay(lecturerId, day);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSlots(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) { setShowAdd(false); setShowBatch(false); setEditId(null); return; }
    fetchSlots(filterDay);
  }, [open, lecturerId]);

  const handleFilterDay = (day: number | undefined) => {
    setFilterDay(day);
    fetchSlots(day);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("add");
    setError("");
    try {
      const res = await createLecturerAvailability({ lecturerId, ...addForm });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
      fetchSlots(filterDay);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setActionLoading(null);
    }
  };

  const openEdit = async (id: string) => {
    setError("");
    try {
      const res = await getLecturerAvailabilityById(id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      const d = res.data;
      setEditForm({ day: d.day, startTime: d.startTime.slice(0, 5), endTime: d.endTime.slice(0, 5), isAvailable: d.isAvailable });
      setEditId(id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load slot");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setActionLoading("edit");
    setError("");
    try {
      const res = await updateLecturerAvailability(editId, editForm);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setEditId(null);
      fetchSlots(filterDay);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    setActionLoading(id);
    setError("");
    try {
      const res = await deleteLecturerAvailability(id);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      fetchSlots(filterDay);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDay = async (day: number) => {
    if (!confirm(`Delete all slots for ${DAY_LABELS[day]}?`)) return;
    setActionLoading("day-" + day);
    setError("");
    try {
      const res = await deleteLecturerAvailabilityByDay(lecturerId, day);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      fetchSlots(filterDay);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.days.length) return;
    setActionLoading("batch");
    setError("");
    try {
      const res = await batchCreateLecturerAvailability({
        lecturerId,
        days: batchForm.days,
        timeSlots: [{ startTime: batchForm.startTime, endTime: batchForm.endTime }],
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setBatchForm(EMPTY_BATCH);
      setShowBatch(false);
      fetchSlots(filterDay);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Batch create failed");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBatchDay = (day: number) =>
    setBatchForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));

  // Group slots by day for display
  const grouped = slots.reduce<Record<number, LecturerAvailabilityItem[]>>((acc, s) => {
    (acc[s.day] ??= []).push(s);
    return acc;
  }, {});

  const timeInput = (value: string, onChange: (v: string) => void) => (
    <input
      type="time"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
    />
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">Availability Schedule</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lecturerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 flex-wrap">
          <select
            value={filterDay ?? ""}
            onChange={(e) => handleFilterDay(e.target.value === "" ? undefined : Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          >
            <option value="">All Days</option>
            {DAY_LABELS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
          <div className="flex-1" />
          <button
            onClick={() => { setShowBatch(true); setShowAdd(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Batch Add
          </button>
          <button
            onClick={() => { setShowAdd(true); setShowBatch(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Slot
          </button>
        </div>

        {error && <p className="mx-6 mt-3 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Add single form */}
        {showAdd && (
          <form onSubmit={handleAdd} className="mx-6 mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-3">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">New Slot</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                <select
                  value={addForm.day}
                  onChange={(e) => setAddForm({ ...addForm, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
                >
                  {DAY_LABELS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start</label>
                {timeInput(addForm.startTime, (v) => setAddForm({ ...addForm, startTime: v }))}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End</label>
                {timeInput(addForm.endTime, (v) => setAddForm({ ...addForm, endTime: v }))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="add-avail"
                type="checkbox"
                checked={addForm.isAvailable}
                onChange={(e) => setAddForm({ ...addForm, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <label htmlFor="add-avail" className="text-xs text-slate-600">Mark as available</label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white transition">Cancel</button>
              <button type="submit" disabled={actionLoading === "add"} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition disabled:opacity-60">
                {actionLoading === "add" ? "Adding…" : "Add"}
              </button>
            </div>
          </form>
        )}

        {/* Batch add form */}
        {showBatch && (
          <form onSubmit={handleBatch} className="mx-6 mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch Add</p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Days</label>
              <div className="flex flex-wrap gap-1.5">
                {DAY_LABELS.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleBatchDay(i)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${batchForm.days.includes(i) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start</label>
                {timeInput(batchForm.startTime, (v) => setBatchForm({ ...batchForm, startTime: v }))}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End</label>
                {timeInput(batchForm.endTime, (v) => setBatchForm({ ...batchForm, endTime: v }))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowBatch(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white transition">Cancel</button>
              <button type="submit" disabled={actionLoading === "batch" || !batchForm.days.length} className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition disabled:opacity-60">
                {actionLoading === "batch" ? "Saving…" : "Save Batch"}
              </button>
            </div>
          </form>
        )}

        {/* Slot list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-12">Loading...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No availability slots found.</p>
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, daySlots]) => (
                <div key={day}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{DAY_LABELS[Number(day)]}</p>
                    <button
                      onClick={() => handleDeleteDay(Number(day))}
                      disabled={actionLoading === "day-" + day}
                      className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition disabled:opacity-40"
                      title="Delete all slots for this day"
                    >
                      {actionLoading === "day-" + day ? "Deleting…" : "Delete day"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${slot.isAvailable ? "bg-emerald-400" : "bg-slate-300"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {slot.startTime.slice(0, 5)} – {slot.endTime.slice(0, 5)}
                          </p>
                          <p className="text-xs text-slate-400">{slot.isAvailable ? "Available" : "Unavailable"}</p>
                        </div>
                        <button
                          onClick={() => openEdit(slot.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          disabled={actionLoading === slot.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Edit Slot</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                <select
                  value={editForm.day}
                  onChange={(e) => setEditForm({ ...editForm, day: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
                >
                  {DAY_LABELS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start</label>
                  {timeInput(editForm.startTime, (v) => setEditForm({ ...editForm, startTime: v }))}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End</label>
                  {timeInput(editForm.endTime, (v) => setEditForm({ ...editForm, endTime: v }))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-avail"
                  type="checkbox"
                  checked={editForm.isAvailable}
                  onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <label htmlFor="edit-avail" className="text-xs text-slate-600">Mark as available</label>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setEditId(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                <button type="submit" disabled={actionLoading === "edit"} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-50">
                  {actionLoading === "edit" ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
