"use client";

import LecturerLayout from "@/app/components/LecturerLayout";
import { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Slot = { start: string; end: string; available: boolean };
type DayAvailability = { day: string; slots: Slot[] };

const initialAvailability: DayAvailability[] = [
  {
    day: "Monday",
    slots: [
      { start: "08:00", end: "09:00", available: true  },
      { start: "10:30", end: "12:00", available: true  },
      { start: "12:00", end: "14:00", available: false },
      { start: "15:00", end: "17:00", available: true  },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { start: "08:00", end: "11:00", available: true  },
      { start: "12:30", end: "14:00", available: true  },
      { start: "14:00", end: "16:00", available: false },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { start: "10:30", end: "12:00", available: true  },
      { start: "12:00", end: "14:00", available: false },
      { start: "15:00", end: "17:00", available: true  },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { start: "08:00", end: "10:00", available: false },
      { start: "12:30", end: "14:00", available: true  },
      { start: "16:00", end: "18:00", available: true  },
    ],
  },
  {
    day: "Friday",
    slots: [
      { start: "08:00", end: "12:00", available: true  },
      { start: "15:00", end: "17:00", available: true  },
    ],
  },
];

export default function LecturerAvailabilityPage() {
  const [availability, setAvailability] = useState(initialAvailability);

  const toggleSlot = (dayIdx: number, slotIdx: number) => {
    setAvailability((prev) =>
      prev.map((d, di) =>
        di !== dayIdx ? d : {
          ...d,
          slots: d.slots.map((s, si) =>
            si !== slotIdx ? s : { ...s, available: !s.available }
          ),
        }
      )
    );
  };

  const totalAvailable = availability.reduce(
    (acc, d) => acc + d.slots.filter((s) => s.available).length, 0
  );

  return (
    <LecturerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Availability</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your weekly availability for scheduling</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-700">{totalAvailable} available slots</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
            Unavailable
          </div>
        </div>

        <div className="space-y-4">
          {availability.map((d, di) => (
            <div key={d.day} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{d.day}</h3>
                <span className="text-xs text-slate-400">
                  {d.slots.filter((s) => s.available).length}/{d.slots.length} slots available
                </span>
              </div>
              <div className="p-4 flex flex-wrap gap-3">
                {d.slots.map((slot, si) => (
                  <button
                    key={si}
                    onClick={() => toggleSlot(di, si)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      slot.available
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${slot.available ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {slot.start} – {slot.end}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center">Click a time slot to toggle availability · Changes saved automatically</p>
      </div>
    </LecturerLayout>
  );
}
