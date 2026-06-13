"use client";

import LecturerLayout from "@/app/components/LecturerLayout";
import { useState } from "react";

type Student = { name: string; id: string; score: number | null; grade: string | null; avatar: string };
type Course = {
  code: string; name: string; department: string; credits: number;
  enrolled: number; capacity: number; room: string; schedule: string;
  avg: number; passRate: number; color: string;
  students: Student[];
};

const courses: Course[] = [
  {
    code: "CS-401", name: "Web Development", department: "Computer Science", credits: 3,
    enrolled: 5, capacity: 160, room: "Tech Hall 204", schedule: "Mon / Wed 9:00–10:30 AM",
    avg: 88, passRate: 94, color: "indigo",
    students: [
      { name: "Ayla Torres",  id: "#10042", score: 88,   grade: "A-",  avatar: "AT" },
      { name: "Ben Nguyen",   id: "#10058", score: 72,   grade: "B",   avatar: "BN" },
      { name: "Clara Kim",    id: "#10067", score: 95,   grade: "A+",  avatar: "CK" },
      { name: "David Osei",   id: "#10073", score: 91,   grade: "A",   avatar: "DO" },
      { name: "Elena Marsh",  id: "#10081", score: null, grade: null,  avatar: "EM" },
    ],
  },
  {
    code: "CS-301", name: "Data Structures", department: "Computer Science", credits: 3,
    enrolled: 4, capacity: 130, room: "Engineering B 102", schedule: "Tue / Thu 11:00 AM–12:30 PM",
    avg: 82, passRate: 89, color: "violet",
    students: [
      { name: "Ayla Torres",  id: "#10042", score: 85,   grade: "A-",  avatar: "AT" },
      { name: "Frank Adeyemi",id: "#10093", score: 78,   grade: "B+",  avatar: "FA" },
      { name: "Grace Liu",    id: "#10099", score: 60,   grade: "C+",  avatar: "GL" },
      { name: "Henry Park",   id: "#10104", score: null, grade: null,  avatar: "HP" },
    ],
  },
  {
    code: "MATH-202", name: "Calculus II", department: "Mathematics", credits: 4,
    enrolled: 3, capacity: 120, room: "Math Hall 310", schedule: "Mon / Wed / Fri 2:00–3:00 PM",
    avg: 76, passRate: 85, color: "amber",
    students: [
      { name: "Ayla Torres",  id: "#10042", score: 92,   grade: "A",   avatar: "AT" },
      { name: "Clara Kim",    id: "#10067", score: 70,   grade: "B-",  avatar: "CK" },
      { name: "Ivan Petrov",  id: "#10112", score: null, grade: null,  avatar: "IP" },
    ],
  },
  {
    code: "CS-201", name: "Intro to Programming", department: "Computer Science", credits: 3,
    enrolled: 4, capacity: 150, room: "Lab C 201", schedule: "Thu 10:00 AM–12:00 PM",
    avg: 79, passRate: 91, color: "emerald",
    students: [
      { name: "Jane Doe",     id: "#10120", score: 84,   grade: "B+",  avatar: "JD" },
      { name: "Karl Müller",  id: "#10135", score: 96,   grade: "A+",  avatar: "KM" },
      { name: "Lena Fischer", id: "#10141", score: 55,   grade: "D+",  avatar: "LF" },
      { name: "Mia Santos",   id: "#10148", score: null, grade: null,  avatar: "MS" },
    ],
  },
];

const colorMap: Record<string, { bar: string; badge: string; gradient: string }> = {
  indigo:  { bar: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700",   gradient: "from-indigo-500 to-violet-600"  },
  violet:  { bar: "bg-violet-500",  badge: "bg-violet-50 text-violet-700",   gradient: "from-violet-500 to-purple-600"  },
  amber:   { bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-700",     gradient: "from-amber-400 to-orange-500"   },
  emerald: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", gradient: "from-emerald-400 to-teal-500"   },
};

const gradeColor = (g: string | null) =>
  !g ? "text-slate-400 bg-slate-50" :
  g.startsWith("A") ? "text-emerald-700 bg-emerald-50" :
  g.startsWith("B") ? "text-indigo-700 bg-indigo-50" :
  g.startsWith("C") ? "text-amber-700 bg-amber-50" :
  "text-red-700 bg-red-50";

export default function LecturerCoursesPage() {
  const [expanded, setExpanded] = useState<string | null>("CS-401");

  return (
    <LecturerLayout>
      <div className="space-y-5 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Courses</h2>
          <p className="text-slate-400 text-sm">
            Fall 2024 · {courses.length} courses · {courses.reduce((s, c) => s + c.enrolled, 0)} students total
          </p>
        </div>

        <div className="space-y-3">
          {courses.map((c) => {
            const cm = colorMap[c.color];
            const open = expanded === c.code;
            const pending = c.students.filter((s) => s.score === null);

            return (
              <div key={c.code} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-shadow ${open ? "shadow-md" : "hover:shadow-md"}`}>
                <button className="w-full text-left" onClick={() => setExpanded(open ? null : c.code)}>
                  <div className={`h-1.5 bg-gradient-to-r ${cm.gradient}`} />
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                        {pending.length > 0 && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{pending.length} ungraded</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1.5">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.schedule} · {c.room}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{c.enrolled}</p>
                        <p className="text-xs text-slate-400">Students</p>
                      </div>
                      <div className="w-20">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Avg</span>
                          <span>{c.avg}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${c.avg}%` }} />
                        </div>
                      </div>
                    </div>

                    <svg className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-5">
                    {/* Meta */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Department",    value: c.department },
                        { label: "Credits",       value: `${c.credits} hrs` },
                        { label: "Enrollment",    value: `${c.enrolled}/${c.capacity}` },
                        { label: "Pass Rate",     value: `${c.passRate}%` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Student scores */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Student Scores</h4>
                      <div className="space-y-2">
                        {c.students.map((s, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {s.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.id}</p>
                            </div>
                            {s.score !== null ? (
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="w-20 hidden sm:block">
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${s.score}%` }} />
                                  </div>
                                </div>
                                <p className="text-sm font-bold text-slate-800 w-8 text-right">{s.score}</p>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${gradeColor(s.grade)}`}>{s.grade}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">Ungraded</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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
