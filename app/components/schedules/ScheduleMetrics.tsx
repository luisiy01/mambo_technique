// components/schedules/ScheduleMetrics.tsx
import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface ScheduleMetricsProps {
  totalClasses: number;
  totalWeeklyHours: number;
  totalStudentsEnrolled: number;
}

export function ScheduleMetrics({ 
  totalClasses, 
  totalWeeklyHours, 
  totalStudentsEnrolled 
}: ScheduleMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clases Activas</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{totalClasses} Talleres</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Horas Semanales</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalWeeklyHours} hrs / sem</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Clock className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alumnos Inscritos</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalStudentsEnrolled} Alumnos</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Users className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}