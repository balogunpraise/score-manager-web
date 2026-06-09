"use client";

import { useEffect, useState } from "react";
import { createStudent, getDepartments, getLevels, Department, Level } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = { firstName: "", middleName: "", lastName: "", email: "", departmentId: "", levelId: "" };

export default function AddStudentModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<typeof initialForm>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    if (!open) return;
    getDepartments().then((r) => { if (r.succeeded) setDepartments(r.data); });
    getLevels().then((r) => { if (r.succeeded) setLevels(r.data ?? []); });
  }, [open]);

  const validate = () => {
    const e: Partial<typeof initialForm> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Invalid email address";
    if (!form.departmentId) e.departmentId = "Department is required";
    if (!form.levelId) e.levelId = "Level is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;
    setServerError("");
    setLoading(true);
    try {
      const res = await createStudent(form);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof initialForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((ev) => ({ ...ev, [key]: undefined }));
    },
  });

  if (!open) return null;

  const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-slate-50/50 ${err ? "border-red-400" : "border-slate-200"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Add Student</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name *</label>
              <input placeholder="John" className={inputCls(errors.firstName)} {...field("firstName")} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name *</label>
              <input placeholder="Doe" className={inputCls(errors.lastName)} {...field("lastName")} />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Middle Name</label>
            <input placeholder="(optional)" className={inputCls()} {...field("middleName")} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
            <input type="email" placeholder="john@example.com" className={inputCls(errors.email)} {...field("email")} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department *</label>
              <select className={inputCls(errors.departmentId)} value={form.departmentId} onChange={field("departmentId").onChange}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-xs text-red-500 mt-1">{errors.departmentId}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Level *</label>
              <select className={inputCls(errors.levelId)} value={form.levelId} onChange={field("levelId").onChange}>
                <option value="">Select level</option>
                {levels.map((l) => <option key={l.id} value={l.id}>{l.levelName}</option>)}
              </select>
              {errors.levelId && <p className="text-xs text-red-500 mt-1">{errors.levelId}</p>}
            </div>
          </div>

          {serverError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Adding…" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
