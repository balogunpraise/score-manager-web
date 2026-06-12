"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { getClassrooms, ClassroomItem, ClassroomType } from "@/lib/api";
import AddClassroomModal from "@/app/components/classroom/AddClassroomModal";
import ClassroomDetailsDrawer from "@/app/components/classroom/ClassroomDetailsDrawer";

const getTypeLabel = (type: number) => {
  const types = ["Lecture", "Lab", "Seminar", "Auditorium"];
  return types[type] || "Unknown";
};

const getTypeColor = (type: number) => {
  const colors = [
    "text-blue-700 bg-blue-50",
    "text-green-700 bg-green-50", 
    "text-purple-700 bg-purple-50",
    "text-orange-700 bg-orange-50"
  ];
  return colors[type] || "text-gray-700 bg-gray-50";
};

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomItem | null>(null);
  const [filters, setFilters] = useState({
    type: "" as string,
    isAvailable: "" as string,
    minCapacity: "" as string,
  });

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {};
      if (filters.type) params.type = parseInt(filters.type);
      if (filters.isAvailable) params.isAvailable = filters.isAvailable === "true";
      if (filters.minCapacity) params.minCapacity = parseInt(filters.minCapacity);

      const res = await getClassrooms(params);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setClassrooms(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load classrooms");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Classrooms</h2>
            <p className="text-slate-400 text-sm">{classrooms.length} classrooms available</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Classroom
          </button>
        </div>

        <AddClassroomModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchClassrooms} 
        />

        <ClassroomDetailsDrawer
          classroom={selectedClassroom}
          open={!!selectedClassroom}
          onClose={() => setSelectedClassroom(null)}
          onUpdate={fetchClassrooms}
        />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                <option value="">All Types</option>
                <option value="0">Lecture</option>
                <option value="1">Lab</option>
                <option value="2">Seminar</option>
                <option value="3">Auditorium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Availability</label>
              <select
                value={filters.isAvailable}
                onChange={(e) => handleFilterChange("isAvailable", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Min Capacity</label>
              <input
                type="number"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange("minCapacity", e.target.value)}
                placeholder="Enter minimum capacity"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))
          ) : classrooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-slate-500 text-sm">No classrooms found</p>
            </div>
          ) : (
            classrooms.map((classroom) => (
              <div
                key={classroom.id}
                onClick={() => setSelectedClassroom(classroom)}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{classroom.name}</h3>
                    <p className="text-xs text-slate-500">{classroom.building}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    classroom.isAvailable ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      classroom.isAvailable ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                    {classroom.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Capacity</span>
                    <span className="text-sm font-medium text-slate-800">{classroom.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Type</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${getTypeColor(classroom.type)}`}>
                      {getTypeLabel(classroom.type)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Projector</span>
                    <span className={`text-xs ${classroom.hasProjector ? "text-green-600" : "text-slate-400"}`}>
                      {classroom.hasProjector ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Scheduled</span>
                    <span className="text-sm font-medium text-slate-800">{classroom.scheduleCount}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}