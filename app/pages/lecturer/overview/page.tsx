"use client";

import LecturerLayout from "@/app/components/LecturerLayout";
import Link from "next/link";

const stats = [
  {
    label: "Allocated Courses",
    value: "4",
    sub: "This semester",
    color: "indigo",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Total Students",
    value: "487",
    sub: "Across all courses",
    color: "violet",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Avg. Class Score",
    value: "81.4",
    sub: "+2.3 from last semester",
    color: "emerald",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Teaching Hours",
    value: "12",
    sub: "Per week",
    color: "amber",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600"  },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600"  },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600"   },
};

const courses = [
  { code: "CS-401", name: "Web Development",  enrolled: 142, avg: 88, passRate: 94, color: "indigo", nextClass: "Mon 9:00 AM",  room: "Tech 204" },
  { code: "CS-301", name: "Data Structures",  enrolled: 118, avg: 82, passRate: 89, color: "violet", nextClass: "Tue 11:00 AM", room: "Eng B 102" },
  { code: "MATH-202", name: "Calculus II",    enrolled: 97,  avg: 76, passRate: 85, color: "amber",  nextClass: "Wed 2:00 PM",  room: "Math 310" },
  { code: "CS-201", name: "Intro to Programming", enrolled: 130, avg: 79, passRate: 91, color: "emerald", nextClass: "Thu 10:00 AM", room: "Lab C 201" },
];

const recentActivity = [
  { student: "Ayla Torres",  course: "Web Development",       action: "Submitted Assignment #4",  time: "2h ago",  avatar: "AT", urgent: false },
  { student: "Ben Nguyen",   course: "Data Structures",       action: "Submitted Lab Report #4",  time: "4h ago",  avatar: "BN", urgent: false },
  { student: "Clara Kim",    course: "Calculus II",           action: "Missed Quiz 3",            time: "1d ago",  avatar: "CK", urgent: true  },
  { student: "David Osei",   course: "Intro to Programming",  action: "Submitted Project Part 2", time: "1d ago",  avatar: "DO", urgent: false },
  { student: "Elena Marsh",  course: "Web Development",       action: "Score below 50% on Quiz",  time: "2d ago",  avatar: "EM", urgent: true  },
];

const todaySchedule = [
  { time: "9:00 – 10:30 AM",  code: "CS-401",   name: "Web Development",       room: "Tech 204",  color: "indigo" },
  { time: "2:00 – 3:00 PM",   code: "MATH-202", name: "Calculus II",           room: "Math 310",  color: "amber"  },
  { time: "4:00 – 5:30 PM",   code: "CS-201",   name: "Intro to Programming",  room: "Lab C 201", color: "emerald" },
];

const courseColorMap: Record<string, { bar: string; badge: string; dot: string }> = {
  indigo:  { bar: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700",   dot: "bg-indigo-500"  },
  violet:  { bar: "bg-violet-500",  badge: "bg-violet-50 text-violet-700",   dot: "bg-violet-500"  },
  amber:   { bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-700",     dot: "bg-amber-500"   },
  emerald: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

export default function LecturerOverviewPage() {
  return (
    <LecturerLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header banner */}
        <div className="relative bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <p className="text-violet-200 text-sm font-medium">Good morning,</p>
            <h2 className="text-2xl font-bold mt-0.5 tracking-tight">Prof. J. Harper 👋</h2>
            <p className="text-violet-200 text-sm mt-1">Semester 1 · Fall 2024 · Computer Science Department</p>
            <div className="flex gap-6 mt-5">
              <div>
                <p className="text-3xl font-bold">4</p>
                <p className="text-violet-200 text-xs mt-0.5">Active Courses</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold">487</p>
                <p className="text-violet-200 text-xs mt-0.5">Students</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-violet-200 text-xs mt-0.5">Classes Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-4">{s.value}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Course performance */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Course Performance</h3>
              <Link href="/pages/lecturer/courses" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all →</Link>
            </div>
            <div className="p-6 space-y-5">
              {courses.map((c) => {
                const cm = courseColorMap[c.color];
                return (
                  <div key={c.code} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cm.badge}`}>{c.code}</span>
                        <span className="font-medium text-slate-700 truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                        <span>{c.enrolled} students</span>
                        <span className="font-semibold text-slate-700">Avg: {c.avg}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cm.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${c.avg}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Next: {c.nextClass} · {c.room}</span>
                      <span className="text-emerald-600 font-medium">{c.passRate}% pass rate</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Today's Classes</h3>
              <Link href="/pages/lecturer/schedule" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Full schedule →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {todaySchedule.map((s, i) => {
                const cm = courseColorMap[s.color];
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cm.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400 truncate">{s.room}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-slate-600">{s.time}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cm.badge}`}>{s.code}</span>
                    </div>
                  </div>
                );
              })}
              {todaySchedule.length === 0 && (
                <p className="px-6 py-8 text-sm text-slate-400 text-center">No classes today</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent student activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Student Activity</h3>
            <Link href="/pages/lecturer/courses" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Manage scores →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{a.student}</p>
                  <p className="text-xs text-slate-400 truncate">{a.course} · {a.action}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.urgent && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Needs attention</span>
                  )}
                  <span className="text-xs text-slate-400">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
