"use client";

import StudentLayout from "@/app/components/StudentLayout";
import { useState } from "react";

type Assignment = { title: string; due: string; score: number | null; max: number; type: string };
type Course = {
  code: string; name: string; instructor: string; email: string;
  schedule: string; room: string; credits: number;
  progress: number; grade: string; score: number;
  color: string; enrolled: number; capacity: number;
  description: string;
  assignments: Assignment[];
};

const courses: Course[] = [
  {
    code: "CS-401", name: "Web Development", instructor: "Prof. Harper", email: "harper@school.edu",
    schedule: "Mon / Wed 9:00–10:30 AM", room: "Tech Hall 204", credits: 3,
    progress: 72, grade: "A-", score: 88, color: "indigo", enrolled: 142, capacity: 160,
    description: "Covers full-stack web development using modern frameworks, REST APIs, and deployment practices.",
    assignments: [
      { title: "HTML/CSS Fundamentals", due: "Sep 20", score: 95, max: 100, type: "Assignment" },
      { title: "JavaScript DOM Lab", due: "Oct 4", score: 88, max: 100, type: "Lab" },
      { title: "React Project Milestone 1", due: "Oct 18", score: 84, max: 100, type: "Project" },
      { title: "React Project Milestone 2", due: "Nov 1", score: 90, max: 100, type: "Project" },
      { title: "Assignment #4 — APIs", due: "Nov 14", score: null, max: 100, type: "Assignment" },
    ],
  },
  {
    code: "CS-301", name: "Data Structures", instructor: "Prof. Chen", email: "chen@school.edu",
    schedule: "Tue / Thu 11:00 AM–12:30 PM", room: "Engineering B 102", credits: 3,
    progress: 65, grade: "B+", score: 82, color: "violet", enrolled: 118, capacity: 130,
    description: "In-depth study of arrays, linked lists, trees, graphs, and algorithmic complexity.",
    assignments: [
      { title: "Arrays & Linked Lists", due: "Sep 22", score: 90, max: 100, type: "Assignment" },
      { title: "Binary Trees Quiz", due: "Oct 6", score: 78, max: 100, type: "Quiz" },
      { title: "Graph Traversal Lab", due: "Oct 20", score: 85, max: 100, type: "Lab" },
      { title: "Midterm Exam", due: "Nov 3", score: 79, max: 100, type: "Exam" },
      { title: "Lab Report #4", due: "Nov 17", score: null, max: 100, type: "Lab" },
    ],
  },
  {
    code: "MATH-202", name: "Calculus II", instructor: "Prof. Okonkwo", email: "okonkwo@school.edu",
    schedule: "Mon / Wed / Fri 2:00–3:00 PM", room: "Math Hall 310", credits: 4,
    progress: 80, grade: "A", score: 92, color: "amber", enrolled: 97, capacity: 120,
    description: "Integral calculus, sequences and series, polar coordinates, and multivariable introduction.",
    assignments: [
      { title: "Integration Techniques HW", due: "Sep 25", score: 98, max: 100, type: "Assignment" },
      { title: "Series Convergence Quiz", due: "Oct 9", score: 92, max: 100, type: "Quiz" },
      { title: "Assignment #3 — Taylor Series", due: "Oct 23", score: 95, max: 100, type: "Assignment" },
      { title: "Midterm", due: "Nov 6", score: 88, max: 100, type: "Exam" },
      { title: "Quiz 3", due: "Nov 15", score: null, max: 100, type: "Quiz" },
    ],
  },
  {
    code: "PHY-101", name: "Physics I", instructor: "Prof. Stein", email: "stein@school.edu",
    schedule: "Thu 10:00 AM–12:00 PM", room: "Science Center 118", credits: 3,
    progress: 55, grade: "B", score: 76, color: "cyan", enrolled: 85, capacity: 100,
    description: "Classical mechanics, kinematics, Newton's laws, energy, momentum, and rotational dynamics.",
    assignments: [
      { title: "Kinematics Problem Set", due: "Sep 28", score: 80, max: 100, type: "Assignment" },
      { title: "Newton's Laws Lab", due: "Oct 12", score: 72, max: 100, type: "Lab" },
      { title: "Energy & Work Quiz", due: "Oct 26", score: 75, max: 100, type: "Quiz" },
      { title: "Lab Report #3", due: "Nov 9", score: 72, max: 100, type: "Lab" },
      { title: "Midterm Exam", due: "Nov 18", score: null, max: 100, type: "Exam" },
    ],
  },
];

const colorMap: Record<string, { gradient: string; bar: string; badge: string; ring: string }> = {
  indigo: { gradient: "from-indigo-500 to-violet-600",  bar: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700",  ring: "ring-indigo-200" },
  violet: { gradient: "from-violet-500 to-purple-600",  bar: "bg-violet-500",  badge: "bg-violet-50 text-violet-700",  ring: "ring-violet-200" },
  amber:  { gradient: "from-amber-400 to-orange-500",   bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-700",    ring: "ring-amber-200"  },
  cyan:   { gradient: "from-cyan-400 to-sky-500",       bar: "bg-cyan-500",    badge: "bg-cyan-50 text-cyan-700",      ring: "ring-cyan-200"   },
};

const typeColor: Record<string, string> = {
  Assignment: "bg-indigo-50 text-indigo-600",
  Lab:        "bg-cyan-50 text-cyan-600",
  Quiz:       "bg-amber-50 text-amber-600",
  Project:    "bg-violet-50 text-violet-600",
  Exam:       "bg-red-50 text-red-600",
};

const gradeColor = (g: string) =>
  g.startsWith("A") ? "text-emerald-700 bg-emerald-50" :
  g.startsWith("B") ? "text-indigo-700 bg-indigo-50" :
  "text-amber-700 bg-amber-50";

export default function StudentCoursesPage() {
  const [expanded, setExpanded] = useState<string | null>("CS-401");

  return (
    <StudentLayout>
      <div className="space-y-5 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Courses</h2>
          <p className="text-slate-400 text-sm">Fall 2024 · {courses.length} enrolled courses · {courses.reduce((s, c) => s + c.credits, 0)} credit hours</p>
        </div>

        <div className="space-y-3">
          {courses.map((c) => {
            const cm = colorMap[c.color];
            const open = expanded === c.code;
            const completed = c.assignments.filter((a) => a.score !== null);
            const pending  = c.assignments.filter((a) => a.score === null);

            return (
              <div key={c.code} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-shadow ${open ? "shadow-md" : "hover:shadow-md"}`}>
                {/* Header — always visible */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(open ? null : c.code)}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${cm.gradient}`} />
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(c.grade)}`}>{c.grade}</span>
                        {pending.length > 0 && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{pending.length} pending</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1.5">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.instructor} · {c.schedule}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{c.score}</p>
                        <p className="text-xs text-slate-400">Score</p>
                      </div>
                      <div className="w-20">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{c.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <svg className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {open && (
                  <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-6">
                    {/* Info row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Room", value: c.room },
                        { label: "Credits", value: `${c.credits} hrs` },
                        { label: "Enrollment", value: `${c.enrolled}/${c.capacity}` },
                        { label: "Instructor Email", value: c.email },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 leading-relaxed">{c.description}</p>

                    {/* Assignments */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Assignments & Assessments</h4>
                      <div className="space-y-2">
                        {c.assignments.map((a, i) => (
                          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${a.score === null ? "border-slate-200 bg-slate-50/60" : "border-transparent bg-white"}`}>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeColor[a.type]}`}>{a.type}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">{a.title}</p>
                              <p className="text-xs text-slate-400">Due {a.due}</p>
                            </div>
                            {a.score !== null ? (
                              <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-slate-800">{a.score}<span className="text-xs text-slate-400 font-normal">/{a.max}</span></p>
                                <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden mt-1">
                                  <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${(a.score / a.max) * 100}%` }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">Pending</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {completed.length} completed
                        <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" />
                        {pending.length} pending
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
