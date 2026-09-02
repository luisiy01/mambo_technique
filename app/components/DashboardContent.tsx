// components/dashboard/DashboardContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Building2, 
  DollarSign, 
  AlertCircle, 
  TrendingUp, 
  Loader2,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { getDashboardData } from '../actions/dashboard';

interface DashboardMetrics {
  activeStudents: number;
  totalSchedules: number;
  totalLocations: number;
  pendingPayments: number;
  monthlyIncome: number;
}

interface RecentPayment {
  id: string;
  studentName: string;
  concept: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
}

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeStudents: 0,
    totalSchedules: 0,
    totalLocations: 0,
    pendingPayments: 0,
    monthlyIncome: 0,
  });
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const data = await getDashboardData();
        setMetrics(data.metrics);
        setRecentPayments(data.recentPayments);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted || isLoading) {
    return (
      <main className="flex-1 p-8 flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Cargando panel principal...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-indigo-600" />
          Panel de Control
        </h2>
        <p className="text-slate-500 text-sm">
          Resumen general de tu academia de baile en tiempo real.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ingresos Mes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingresos del Mes</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              ${metrics.monthlyIncome.toLocaleString('es-MX')} MXN
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Alumnos Activos */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alumnos Activos</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.activeStudents}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Clases / Horarios */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Talleres / Horarios</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.totalSchedules}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cobros Pendientes</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{metrics.pendingPayments} Alumnos</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Sección Inferior: Accesos Rápidos y Últimos Pagos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Actividad Reciente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              Últimos Pagos Registrados
            </h3>
            <Link 
              href="/dashboard/payments" 
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">Alumno</th>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentPayments.length > 0 ? (
                  recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{p.studentName}</td>
                      <td className="py-2.5 px-3">{p.concept}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">${p.amount.toLocaleString('es-MX')} MXN</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">{p.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Aún no hay pagos registrados en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tarjetas de Accesos Rápidos */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Gestión de la Academia</h3>
            <div className="space-y-2">
              <Link 
                href="/dashboard/students"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" /> Administrar Alumnos
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link 
                href="/dashboard/schedules"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" /> Ver Horarios y Talleres
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link 
                href="/dashboard/locations"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-600" /> Configurar Sedes ({metrics.totalLocations})
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}