// components/students/StudentMetrics.tsx
import React from 'react';
import { Users, UserCheck, AlertCircle } from 'lucide-react';

interface StudentMetricsProps {
  total: number;
  active: number;
  pendingPayment: number;
}

export function StudentMetrics({ total, active, pendingPayment }: StudentMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Alumnos</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{total}</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activos Este Mes</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{active}</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <UserCheck className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pagos Pendientes</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingPayment}</p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <AlertCircle className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}