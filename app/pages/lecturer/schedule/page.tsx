"use client";

import LecturerLayout from "@/app/components/LecturerLayout";
import { useEffect, useState } from "react";
import { getCurrentUser, getMyLecturerSchedule, getAcademicSessions, type ScheduleItem, type AcademicSession } from "@/lib/api";

const SEMESTERS = [
  { label: "First", value: "1" },
  { label: "Second", value: "2" },
  { label: "First & Second", value: "3" },
];

const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = Array.from({ length: 11 }, (_, i) => i + 8);
const fmt = (h: number) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
const GRID_START = 8;

const COLORS = ["indigo", "violet", "amber", "emerald", "rose", "sky"] as const;
type Color = (typeof COLORS)[number];

const colorMap: Record<Color, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-300",  text: "text-indigo-700",  dot: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700"  },
  violet:  { bg: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-700",  dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700"  },
  amber:   { bg: "bg-amber-50",   border: "border-amber-300",   text: "text-amber-700",   dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-300",    text: "text-rose-700",    dot: "bg-rose-500",    badge: "bg-rose-50 text-rose-700"      },
  sky:     { bg: "bg-sky-50",     border: "border-sky-300",     text: "text-sky-700",     dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700"        },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function LecturerSchedulePage() {
  const [semester, setSemester] = useState("");
  const [academicSessionId, setAcademicSessionId] = useState("");
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    getAcademicSessions()
      .then((res) => { if (res.succeeded) setSessions(res.data); })
      .catch(() => {});
  }, []);

  const fetchSchedule = async () => {
    if (!semester || !academicSessionId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getMyLecturerSchedule({ Semester: semester, AcademicSessionId: academicSessionId });
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSchedules(res.data);
      setHasFetched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const courseColors = new Map<string, Color>();
  schedules.forEach(({ courseId }) => {
    if (!courseColors.has(courseId))
      courseColors.set(courseId, COLORS[courseColors.size % COLORS.length]);
  });

  const weekdaySchedules = schedules.filter((s) => s.day >= 1 && s.day <= 5);

  const legend = [...courseColors.entries()].map(([courseId, color]) => {
    const match = schedules.find((s) => s.courseId === courseId)!;
    return { code: match.courseCode, name: match.courseTitle, color };
  });

  const sortedWeek = [...weekdaySchedules].sort(
    (a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime)
  );

  const canFetch = semester && academicSessionId;

  return (
    <LecturerLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule</h2>
          <p className="text-slate-400 text-sm">
            {hasFetched
              ? `${schedules.length} session${schedules.length !== 1 ? "s" : ""} — ${sessions.find(s => s.id === academicSessionId)?.sessionCode} · Semester ${semester}`
              : "Select filters to load your schedule"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="flex-1 min-w-40 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={academicSessionId}
            onChange={(e) => setAcademicSessionId(e.target.value)}
            className="flex-1 min-w-52 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          >
            <option value="">Select Academic Session</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.sessionCode}</option>
            ))}
          </select>
          <button
            onClick={fetchSchedule}
            disabled={!canFetch || loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold transition"
          >
            {loading ? "Loading…" : "Load Schedule"}
          </button>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {hasFetched && (
          <>
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Timetable */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[56px_repeat(5,1fr)] border-b border-slate-100">
                  <div className="p-3" />
                  {shortDays.map((d) => (
                    <div key={d} className="p-3 text-center border-l border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-y-auto max-h-[480px]">
                  <div className="relative grid grid-cols-[56px_repeat(5,1fr)]">
                    {hours.map((h) => (
                      <div key={h} className="contents">
                        <div className="px-2 flex items-start justify-end pt-1" style={{ height: 56 }}>
                          <span className="text-[10px] text-slate-300 font-medium">{fmt(h)}</span>
                        </div>
                        {shortDays.map((_, di) => (
                          <div key={di} className="border-l border-t border-slate-100" style={{ height: 56 }} />
                        ))}
                      </div>
                    ))}
                    {weekdaySchedules.map((s) => {
                      const color = courseColors.get(s.courseId)!;
                      const cm = colorMap[color];
                      const top = (parseHour(s.startTime) - GRID_START) * 56;
                      const height = (parseHour(s.endTime) - parseHour(s.startTime)) * 56 - 4;
                      const colW = 100 / 5;
                      const left = `calc(56px + ${(s.day - 1) * colW}%)`;
                      const width = `calc(${colW}% - 4px)`;
                      return (
                        <div
                          key={s.id}
                          className={`absolute rounded-lg border-l-2 ${cm.bg} ${cm.border} px-2 py-1.5 overflow-hidden z-10`}
                          style={{ top, height, left, width }}
                        >
                          <p className={`text-[11px] font-bold leading-tight ${cm.text} truncate`}>{s.courseCode}</p>
                          <p className={`text-[10px] ${cm.text} opacity-70 truncate`}>{s.classroomName}</p>
                          <p className={`text-[10px] ${cm.text} opacity-60 truncate`}>{formatTime(s.startTime)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sessions list */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">All Sessions</h3>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                  {sortedWeek.length === 0 ? (
                    <p className="px-5 py-8 text-sm text-slate-400 text-center">No sessions found</p>
                  ) : sortedWeek.map((s) => {
                    const color = courseColors.get(s.courseId)!;
                    const cm = colorMap[color];
                    return (
                      <div key={s.id} className="flex gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{s.courseTitle}</p>
                          <p className="text-xs text-slate-400 truncate">{s.classroomName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-400">{DAY_NAMES[s.day]}</span>
                            <span className="text-[11px] text-slate-300">·</span>
                            <span className={`text-[11px] font-semibold ${cm.text}`}>
                              {formatTime(s.startTime)} – {formatTime(s.endTime)}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold self-start mt-1 px-2 py-0.5 rounded-full ${cm.badge}`}>
                          {s.courseCode}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            {legend.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {legend.map((l) => {
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
            )}
          </>
        )}
      </div>
    </LecturerLayout>
  );
}
