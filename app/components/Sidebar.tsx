// components/Sidebar.tsx
import React from 'react';
import { 
  MapPin, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-wide">Mambo Dance & Technique</h1>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 font-medium text-white transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            Dashboard
          </a>
          <a
            href="/dashboard/locations"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <MapPin className="h-5 w-5" />
            Lugares de Clases
          </a>
          <a
            href="/dashboard/students"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users className="h-5 w-5" />
            Alumnos
          </a>
          <a
            href="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <CreditCard className="h-5 w-5" />
            Pagos
          </a>
        </nav>
      </div>

      <div className="px-2 py-4 border-t border-slate-800 text-xs text-slate-400">
        Panel de Control de Baile v1.0
      </div>
    </aside>
  );
}