"use client";

import StudentLayout from "@/app/components/StudentLayout";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// time slots 8am–6pm in 1hr increments
const hours = Array.from({ length: 11 }, (_, i) => i + 8);
const fmt = (h: number) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;

type ClassBlock = {
  code: string; name: string; room: string; instructor: string;
  day: number; startHour: number; endHour: number; color: string;
};

const classes: ClassBlock[] = [
  { code: "CS-401", name: "Web Development",  room: "Tech 204",   instructor: "Prof. Harper",  day: 0, startHour: 9,  endHour: 10.5, color: "indigo" },
  { code: "CS-401", name: "Web Development",  room: "Tech 204",   instructor: "Prof. Harper",  day: 2, startHour: 9,  endHour: 10.5, color: "indigo" },
  { code: "CS-301", name: "Data Structures",  room: "Eng B 102",  instructor: "Prof. Chen",    day: 1, startHour: 11, endHour: 12.5, color: "violet" },
  { code: "CS-301", name: "Data Structures",  room: "Eng B 102",  instructor: "Prof. Chen",    day: 3, startHour: 11, endHour: 12.5, color: "violet" },
  { code: "MATH-202", name: "Calculus II",    room: "Math 310",   instructor: "Prof. Okonkwo", day: 0, startHour: 14, endHour: 15,   color: "amber"  },
  { code: "MATH-202", name: "Calculus II",    room: "Math 310",   instructor: "Prof. Okonkwo", day: 2, startHour: 14, endHour: 15,   color: "amber"  },
  { code: "MATH-202", name: "Calculus II",    room: "Math 310",   instructor: "Prof. Okonkwo", day: 4, startHour: 14, endHour: 15,   color: "amber"  },
  { code: "PHY-101",  name: "Physics I",      room: "Sci 118",    instructor: "Prof. Stein",   day: 3, startHour: 10, endHour: 12,   color: "cyan"   },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700", dot: "bg-indigo-500" },
  violet: { bg: "bg-violet-50", border: "border-violet-300", text: "text-violet-700", dot: "bg-violet-500" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-300",  text: "text-amber-700",  dot: "bg-amber-500"  },
  cyan:   { bg: "bg-cyan-50",   border: "border-cyan-300",   text: "text-cyan-700",   dot: "bg-cyan-500"   },
};

const upcomingEvents = [
  { date: "Mon, Nov 13", time: "9:00 AM",  title: "Web Development",         room: "Tech 204",  type: "Lecture", color: "indigo" },
  { date: "Mon, Nov 13", time: "2:00 PM",  title: "Calculus II",             room: "Math 310",  type: "Lecture", color: "amber"  },
  { date: "Tue, Nov 14", time: "11:00 AM", title: "Data Structures",         room: "Eng B 102", type: "Lecture", color: "violet" },
  { date: "Wed, Nov 15", time: "9:00 AM",  title: "Web Development",         room: "Tech 204",  type: "Lecture", color: "indigo" },
  { date: "Wed, Nov 15", time: "9:00 AM",  title: "Calculus II — Quiz 3",    room: "Math 310",  type: "Quiz",    color: "amber"  },
  { date: "Thu, Nov 16", time: "10:00 AM", title: "Physics I",               room: "Sci 118",   type: "Lecture", color: "cyan"   },
  { date: "Thu, Nov 16", time: "11:00 AM", title: "Data Structures",         room: "Eng B 102", type: "Lecture", color: "violet" },
  { date: "Fri, Nov 17", time: "2:00 PM",  title: "Calculus II",             room: "Math 310",  type: "Lecture", color: "amber"  },
  { date: "Fri, Nov 17", time: "5:00 PM",  title: "DS Lab Report Due",       room: "Online",    type: "Deadline",color: "violet" },
];

const typeIcon: Record<string, string> = {
  Lecture: "📚", Quiz: "📝", Exam: "📋", Deadline: "⏰", Lab: "🔬",
};

const GRID_START = 8;
const GRID_END   = 19;
const TOTAL_HRS  = GRID_END - GRID_START;

export default function StudentSchedulePage() {
  return (
    <StudentLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule</h2>
          <p className="text-slate-400 text-sm">Week of Nov 13 – 17, 2024</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Timetable */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[56px_repeat(5,1fr)] border-b border-slate-100">
              <div className="p-3" />
              {days.map((d, i) => (
                <div key={d} className="p-3 text-center border-l border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{shortDays[i]}</p>
                </div>
              ))}
            </div>

            {/* Scrollable grid */}
            <div className="overflow-y-auto max-h-[480px]">
              <div className="relative grid grid-cols-[56px_repeat(5,1fr)]">
                {/* Hour labels + row lines */}
                {hours.map((h) => (
                  <div key={h} className="contents">
                    <div className="px-2 py-0 flex items-start justify-end pt-1" style={{ height: 56 }}>
                      <span className="text-[10px] text-slate-300 font-medium">{fmt(h)}</span>
                    </div>
                    {days.map((d, di) => (
                      <div key={di} className="border-l border-t border-slate-100 relative" style={{ height: 56 }} />
                    ))}
                  </div>
                ))}

                {/* Class blocks absolutely positioned */}
                {classes.map((cls, idx) => {
                  const cm = colorMap[cls.color];
                  const top    = (cls.startHour - GRID_START) * 56;
                  const height = (cls.endHour - cls.startHour) * 56 - 4;
                  // col: day + 1 (account for time col), but we use absolute within each col
                  // We need to position within the col — use left% trick
                  const colW = 100 / 5;
                  const left = `calc(56px + ${cls.day * colW}%)`;
                  const width = `calc(${colW}% - 4px)`;

                  return (
                    <div
                      key={idx}
                      className={`absolute rounded-lg border-l-2 ${cm.bg} ${cm.border} px-2 py-1.5 overflow-hidden z-10`}
                      style={{ top, height, left, width }}
                    >
                      <p className={`text-[11px] font-bold leading-tight ${cm.text} truncate`}>{cls.code}</p>
                      <p className={`text-[10px] ${cm.text} opacity-70 truncate`}>{cls.room}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming events list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">This Week</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {upcomingEvents.map((e, i) => {
                const cm = colorMap[e.color];
                return (
                  <div key={i} className="flex gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                    <div className="shrink-0 text-lg leading-none mt-0.5">{typeIcon[e.type] ?? "📌"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                      <p className="text-xs text-slate-400 truncate">{e.room}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400">{e.date}</span>
                        <span className="text-[11px] text-slate-300">·</span>
                        <span className={`text-[11px] font-semibold ${cm.text}`}>{e.time}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold self-start mt-1 px-2 py-0.5 rounded-full ${cm.bg} ${cm.text}`}>{e.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {[
            { code: "CS-401", name: "Web Development",  color: "indigo" },
            { code: "CS-301", name: "Data Structures",  color: "violet" },
            { code: "MATH-202", name: "Calculus II",    color: "amber"  },
            { code: "PHY-101", name: "Physics I",       color: "cyan"   },
          ].map((l) => {
            const cm = colorMap[l.color];
            return (
              <div key={l.code} className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-3 py-2">
                <span className={`w-2.5 h-2.5 rounded-sm ${cm.dot}`} />
                <span className="font-medium">{l.code}</span>
                <span className="text-slate-300">·</span>
                {l.name}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
