"use client";

import LecturerLayout from "@/app/components/LecturerLayout";
import { useEffect, useState } from "react";
import { getAssignedCourses, type AllocatedCourse } from "@/lib/api";

const COLORS = ["indigo", "violet", "amber", "emerald", "sky", "rose"];

const colorMap: Record<string, { bar: string; badge: string; gradient: string }> = {
  indigo:  { bar: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700",   gradient: "from-indigo-500 to-violet-600"  },
  violet:  { bar: "bg-violet-500",  badge: "bg-violet-50 text-violet-700",   gradient: "from-violet-500 to-purple-600"  },
  amber:   { bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-700",     gradient: "from-amber-400 to-orange-500"   },
  emerald: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", gradient: "from-emerald-400 to-teal-500"   },
  sky:     { bar: "bg-sky-500",     badge: "bg-sky-50 text-sky-700",         gradient: "from-sky-400 to-cyan-500"       },
  rose:    { bar: "bg-rose-500",    badge: "bg-rose-50 text-rose-700",       gradient: "from-rose-400 to-pink-500"      },
};

export default function LecturerCoursesPage() {
  const [courses, setCourses] = useState<AllocatedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAssignedCourses()
      .then((res) => {
        if (res.succeeded) {
          setCourses(res.data);
          if (res.data.length > 0) setExpanded(res.data[0].courseId);
        } else {
          setError(res.message || "Failed to load courses");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <LecturerLayout>
      <div className="space-y-5 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Courses</h2>
          <p className="text-slate-400 text-sm">
            {loading ? "Loading..." : `${courses.length} assigned course${courses.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-12 text-center text-slate-400 text-sm">
            No courses assigned yet.
          </div>
        )}

        <div className="space-y-3">
          {courses.map((c, idx) => {
            const color = COLORS[idx % COLORS.length];
            const cm = colorMap[color];
            const open = expanded === c.courseId;

            return (
              <div key={c.courseId} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-shadow ${open ? "shadow-md" : "hover:shadow-md"}`}>
                <button className="w-full text-left" onClick={() => setExpanded(open ? null : c.courseId)}>
                  <div className={`h-1.5 bg-gradient-to-r ${cm.gradient}`} />
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.courseCode}</span>
                        {c.isElective && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600">Elective</span>
                        )}
                        {c.isGeneralStudies && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Gen. Studies</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1.5">{c.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.department} · {c.faculty}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{c.creditHours}</p>
                        <p className="text-xs text-slate-400">Credits</p>
                      </div>
                      {c.level && (
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-900">{c.level}</p>
                          <p className="text-xs text-slate-400">Level</p>
                        </div>
                      )}
                    </div>

                    <svg className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Department",   value: c.department },
                        { label: "Faculty",      value: c.faculty },
                        { label: "Credit Hours", value: `${c.creditHours} hrs` },
                        { label: "Level",        value: c.level || "—" },
                        { label: "Allocated On", value: new Date(c.allocatedOn).toLocaleDateString() },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>

                    {c.description && (
                      <p className="text-sm text-slate-500 leading-relaxed">{c.description}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LecturerLayout>
  );
}
