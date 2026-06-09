"use client";

import StudentLayout from "@/app/components/StudentLayout";

const summary = [
  { label: "Cumulative GPA", value: "3.60", sub: "out of 4.0" },
  { label: "Semester GPA",   value: "3.72", sub: "Fall 2024"  },
  { label: "Credits Earned", value: "42",   sub: "of 120 required" },
  { label: "Class Standing", value: "Junior", sub: "3rd Year" },
];

const courses = [
  {
    code: "CS-401", name: "Web Development", credits: 3, color: "indigo",
    assignments: [
      { title: "HTML/CSS Fundamentals", type: "Assignment", score: 95,  max: 100, weight: 10 },
      { title: "JavaScript DOM Lab",    type: "Lab",        score: 88,  max: 100, weight: 15 },
      { title: "React Milestone 1",     type: "Project",    score: 84,  max: 100, weight: 20 },
      { title: "React Milestone 2",     type: "Project",    score: 90,  max: 100, weight: 20 },
      { title: "Assignment #4 — APIs",  type: "Assignment", score: null, max: 100, weight: 15 },
      { title: "Final Project",         type: "Project",    score: null, max: 100, weight: 20 },
    ],
    currentGrade: "A-", currentScore: 88,
  },
  {
    code: "CS-301", name: "Data Structures", credits: 3, color: "violet",
    assignments: [
      { title: "Arrays & Linked Lists", type: "Assignment", score: 90, max: 100, weight: 10 },
      { title: "Binary Trees Quiz",     type: "Quiz",       score: 78, max: 100, weight: 10 },
      { title: "Graph Traversal Lab",   type: "Lab",        score: 85, max: 100, weight: 15 },
      { title: "Midterm Exam",          type: "Exam",       score: 79, max: 100, weight: 30 },
      { title: "Lab Report #4",         type: "Lab",        score: null, max: 100, weight: 15 },
      { title: "Final Exam",            type: "Exam",       score: null, max: 100, weight: 20 },
    ],
    currentGrade: "B+", currentScore: 82,
  },
  {
    code: "MATH-202", name: "Calculus II", credits: 4, color: "amber",
    assignments: [
      { title: "Integration HW",           type: "Assignment", score: 98, max: 100, weight: 10 },
      { title: "Series Convergence Quiz",  type: "Quiz",       score: 92, max: 100, weight: 10 },
      { title: "Assignment #3",            type: "Assignment", score: 95, max: 100, weight: 10 },
      { title: "Midterm",                  type: "Exam",       score: 88, max: 100, weight: 30 },
      { title: "Quiz 3",                   type: "Quiz",       score: null, max: 100, weight: 10 },
      { title: "Final Exam",               type: "Exam",       score: null, max: 100, weight: 30 },
    ],
    currentGrade: "A", currentScore: 92,
  },
  {
    code: "PHY-101", name: "Physics I", credits: 3, color: "cyan",
    assignments: [
      { title: "Kinematics Problem Set", type: "Assignment", score: 80, max: 100, weight: 10 },
      { title: "Newton's Laws Lab",      type: "Lab",        score: 72, max: 100, weight: 15 },
      { title: "Energy & Work Quiz",     type: "Quiz",       score: 75, max: 100, weight: 10 },
      { title: "Lab Report #3",          type: "Lab",        score: 72, max: 100, weight: 15 },
      { title: "Midterm Exam",           type: "Exam",       score: null, max: 100, weight: 30 },
      { title: "Final Exam",             type: "Exam",       score: null, max: 100, weight: 20 },
    ],
    currentGrade: "B", currentScore: 76,
  },
];

const colorMap: Record<string, { bar: string; badge: string; gradient: string }> = {
  indigo: { bar: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700", gradient: "from-indigo-500 to-violet-500" },
  violet: { bar: "bg-violet-500", badge: "bg-violet-50 text-violet-700", gradient: "from-violet-500 to-purple-500" },
  amber:  { bar: "bg-amber-500",  badge: "bg-amber-50 text-amber-700",   gradient: "from-amber-400 to-orange-500" },
  cyan:   { bar: "bg-cyan-500",   badge: "bg-cyan-50 text-cyan-700",     gradient: "from-cyan-400 to-sky-500"    },
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

const scoreToGpaPoint = (score: number) =>
  score >= 97 ? 4.0 : score >= 93 ? 4.0 : score >= 90 ? 3.7 :
  score >= 87 ? 3.3 : score >= 83 ? 3.0 : score >= 80 ? 2.7 :
  score >= 77 ? 2.3 : score >= 73 ? 2.0 : score >= 70 ? 1.7 : 1.0;

export default function StudentGradesPage() {
  return (
    <StudentLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Grades</h2>
          <p className="text-slate-400 text-sm">Fall 2024 · Detailed grade breakdown per course</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
              <p className="text-xs font-semibold text-slate-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* GPA bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Grade Distribution</h3>
            <span className="text-xs text-slate-400">Current semester</span>
          </div>
          <div className="flex gap-2 h-10 rounded-xl overflow-hidden">
            {courses.map((c) => {
              const cm = colorMap[c.color];
              return (
                <div key={c.code} title={`${c.name}: ${c.currentScore}`}
                  className={`bg-gradient-to-r ${cm.gradient} flex items-center justify-center text-white text-xs font-bold transition-all hover:opacity-90`}
                  style={{ flex: c.credits }}>
                  {c.currentGrade}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {courses.map((c) => {
              const cm = colorMap[c.color];
              return (
                <div key={c.code} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={`w-2.5 h-2.5 rounded-sm ${cm.bar}`} />
                  {c.code}
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-course breakdown */}
        <div className="space-y-4">
          {courses.map((c) => {
            const cm = colorMap[c.color];
            const completed = c.assignments.filter((a) => a.score !== null);
            const weightedSum = completed.reduce((s, a) => s + (a.score! / a.max) * a.weight, 0);
            const weightCompleted = completed.reduce((s, a) => s + a.weight, 0);
            const projected = weightCompleted > 0 ? ((weightedSum / weightCompleted) * 100).toFixed(1) : "—";

            return (
              <div key={c.code} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${cm.gradient}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                      <h4 className="font-bold text-slate-800">{c.name}</h4>
                      <span className="text-xs text-slate-400">{c.credits} credits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Current</p>
                        <p className="text-sm font-bold text-slate-800">{c.currentScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></p>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-xl ${gradeColor(c.currentGrade)}`}>{c.currentGrade}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2">Assessment</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 hidden sm:table-cell">Type</th>
                          <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2">Weight</th>
                          <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2">Score</th>
                          <th className="w-24 pb-2 hidden sm:table-cell" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {c.assignments.map((a, i) => (
                          <tr key={i} className={a.score === null ? "opacity-50" : ""}>
                            <td className="py-2.5 pr-4 font-medium text-slate-700">{a.title}</td>
                            <td className="py-2.5 pr-4 hidden sm:table-cell">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColor[a.type]}`}>{a.type}</span>
                            </td>
                            <td className="py-2.5 text-right text-slate-400 text-xs">{a.weight}%</td>
                            <td className="py-2.5 text-right font-bold text-slate-800">
                              {a.score !== null ? (
                                <span>{a.score}<span className="text-xs text-slate-400 font-normal">/{a.max}</span></span>
                              ) : (
                                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                              )}
                            </td>
                            <td className="py-2.5 pl-3 hidden sm:table-cell">
                              {a.score !== null && (
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${(a.score / a.max) * 100}%` }} />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{completed.length}/{c.assignments.length} assessments graded</span>
                    <span>Projected score: <span className="text-slate-600 font-semibold">{projected}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
