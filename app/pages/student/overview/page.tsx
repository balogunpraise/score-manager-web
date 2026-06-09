"use client";

import StudentLayout from "@/app/components/StudentLayout";
import Link from "next/link";

const enrolledCourses = [
  { code: "CS-401", name: "Web Development", instructor: "Prof. Harper", progress: 72, grade: "A-", score: 88, color: "indigo", nextClass: "Mon 9:00 AM" },
  { code: "CS-301", name: "Data Structures", instructor: "Prof. Chen", progress: 65, grade: "B+", score: 82, color: "violet", nextClass: "Tue 11:00 AM" },
  { code: "MATH-202", name: "Calculus II", instructor: "Prof. Okonkwo", progress: 80, grade: "A", score: 92, color: "amber", nextClass: "Wed 2:00 PM" },
  { code: "PHY-101", name: "Physics I", instructor: "Prof. Stein", progress: 55, grade: "B", score: 76, color: "cyan", nextClass: "Thu 10:00 AM" },
];

const upcoming = [
  { task: "Web Dev — Assignment #4", due: "Tomorrow, 11:59 PM", urgent: true, type: "Assignment" },
  { task: "Calculus II — Quiz 3", due: "Nov 15, 9:00 AM", urgent: true, type: "Quiz" },
  { task: "Data Structures — Lab Report", due: "Nov 17, 5:00 PM", urgent: false, type: "Lab" },
  { task: "Physics I — Midterm", due: "Nov 18, 10:00 AM", urgent: false, type: "Exam" },
];

const recentGrades = [
  { course: "Calculus II", task: "Assignment #5", score: 95, max: 100, grade: "A+" },
  { course: "Web Development", task: "Project Milestone 2", score: 84, max: 100, grade: "B+" },
  { course: "Data Structures", task: "Quiz 4", score: 78, max: 100, grade: "B+" },
  { course: "Physics I", task: "Lab Report #3", score: 72, max: 100, grade: "B" },
];

const colorMap: Record<string, { bar: string; badge: string; light: string }> = {
  indigo: { bar: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700", light: "bg-indigo-50" },
  violet: { bar: "bg-violet-500", badge: "bg-violet-50 text-violet-700", light: "bg-violet-50" },
  amber:  { bar: "bg-amber-500",  badge: "bg-amber-50 text-amber-700",   light: "bg-amber-50"  },
  cyan:   { bar: "bg-cyan-500",   badge: "bg-cyan-50 text-cyan-700",     light: "bg-cyan-50"   },
};

const typeColor: Record<string, string> = {
  Assignment: "bg-indigo-50 text-indigo-700",
  Quiz:       "bg-amber-50 text-amber-700",
  Lab:        "bg-cyan-50 text-cyan-700",
  Exam:       "bg-red-50 text-red-700",
};

const gradeColor = (g: string) =>
  g.startsWith("A") ? "text-emerald-700 bg-emerald-50" :
  g.startsWith("B") ? "text-indigo-700 bg-indigo-50" :
  "text-amber-700 bg-amber-50";

const overallGPA = 3.6;

export default function StudentOverviewPage() {
  return (
    <StudentLayout>
      <div className="space-y-6 max-w-6xl mx-auto">

        {/* Welcome banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <p className="text-indigo-200 text-sm font-medium">Welcome back,</p>
            <h2 className="text-2xl font-bold mt-0.5 tracking-tight">Ayla Torres 👋</h2>
            <p className="text-indigo-200 text-sm mt-1">Semester 1 · Fall 2024 · Student ID #10042</p>
            <div className="flex gap-6 mt-5">
              <div>
                <p className="text-3xl font-bold">{overallGPA}</p>
                <p className="text-indigo-200 text-xs mt-0.5">Current GPA</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                <p className="text-indigo-200 text-xs mt-0.5">Active Courses</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold">{upcoming.length}</p>
                <p className="text-indigo-200 text-xs mt-0.5">Due This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course progress strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {enrolledCourses.map((c) => {
            const cm = colorMap[c.color];
            return (
              <Link href="/pages/student/courses" key={c.code}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(c.grade)}`}>{c.grade}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors">{c.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 mb-3">{c.instructor}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span className="font-medium text-slate-600">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Upcoming deadlines */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Upcoming Deadlines</h3>
              <Link href="/pages/student/schedule" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View schedule →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${u.urgent ? "bg-red-500" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{u.task}</p>
                    <p className={`text-xs mt-0.5 font-medium ${u.urgent ? "text-red-500" : "text-slate-400"}`}>{u.due}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${typeColor[u.type]}`}>{u.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent grades */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Recent Grades</h3>
              <Link href="/pages/student/grades" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">All grades →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentGrades.map((g, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{g.task}</p>
                    <p className="text-xs text-slate-400 truncate">{g.course}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{g.score}<span className="text-xs text-slate-400 font-normal">/{g.max}</span></p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${gradeColor(g.grade)}`}>{g.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
