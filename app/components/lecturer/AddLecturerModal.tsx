"use client";

import { useState } from "react";
import {
  createLecturer,
  getLevels,
  getCourses,
  AcademicRank,
  Qualification,
  Specialization,
  Level,
  CourseItem,
} from "@/lib/api";
import { useEffect } from "react";

const RANK_LABELS = ["Graduate Assistant", "Assistant Lecturer", "Lecturer", "Senior Lecturer", "Associate Professor", "Professor"];
const QUAL_LABELS = ["Bachelor", "Master", "Doctorate"];
const SPEC_LABELS = ["Art", "Business", "Science", "Social Sciences", "Engineering", "IT", "Humanities", "Medicine", "Mathematics"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY = {
  firstName: "", lastName: "", middleName: "", email: "",
  phoneNumber: "", qualification: 0, specialization: 0, rank: 0,
  yearsOfExperience: "", prefferedLevels: [] as string[], preferedCourses: [] as string[],
};

export default function AddLecturerModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [levels, setLevels] = useState<Level[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    getLevels().then((r) => setLevels(r.data ?? []));
    getCourses({ PageSize: 100 }).then((r) => setCourses(r.data?.items ?? []));
  }, [open]);

  const toggleList = (key: "prefferedLevels" | "preferedCourses", id: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createLecturer({
        ...form,
        prefferedLevels: form.prefferedLevels.map((id) => ({ levelId: id })),
        preferedCourses: form.preferedCourses.map((id) => ({ courseId: id })),
      });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setForm(EMPTY);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add lecturer");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const field = (label: string, children: React.ReactNode) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );

  const input = (name: keyof typeof EMPTY, type = "text", placeholder = "") => (
    <input
      type={type}
      required={["firstName", "lastName", "email"].includes(name)}
      placeholder={placeholder}
      value={form[name] as string}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
    />
  );

  const select = (name: "qualification" | "specialization" | "rank", labels: string[]) => (
    <select
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: Number(e.target.value) })}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 transition"
    >
      {labels.map((l, i) => <option key={i} value={i}>{l}</option>)}
    </select>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Add Lecturer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {field("First Name", input("firstName", "text", "John"))}
            {field("Middle Name", input("middleName", "text", "A."))}
            {field("Last Name", input("lastName", "text", "Doe"))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Email", input("email", "email", "john@university.edu"))}
            {field("Phone Number", input("phoneNumber", "tel", "+1234567890"))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {field("Qualification", select("qualification", QUAL_LABELS))}
            {field("Specialization", select("specialization", SPEC_LABELS))}
            {field("Rank", select("rank", RANK_LABELS))}
          </div>
          {field("Years of Experience", input("yearsOfExperience", "text", "5"))}

          {/* Preferred Levels */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Levels</label>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => {
                const checked = form.prefferedLevels.includes(l.id);
                return (
                  <button type="button" key={l.id} onClick={() => toggleList("prefferedLevels", l.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${checked ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
                    {l.levelName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Courses */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Courses</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {courses.map((c) => {
                const checked = form.preferedCourses.includes(c.id);
                return (
                  <button type="button" key={c.id} onClick={() => toggleList("preferedCourses", c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${checked ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
                    {c.courseCode} – {c.title}
                  </button>
                );
              })}
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
            {loading ? "Adding…" : "Add Lecturer"}
          </button>
        </div>
      </div>
    </div>
  );
}
