// components/payments/PaymentMetrics.tsx
import React from 'react';
import { DollarSign, CheckCircle2, Clock } from 'lucide-react';

interface PaymentMetricsProps {
  totalMonthIncome: number;
  completedPaymentsCount: number;
  pendingAmount: number;
}

export function PaymentMetrics({ 
  totalMonthIncome, 
  completedPaymentsCount, 
  pendingAmount 
}: PaymentMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingresos del Mes</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            ${totalMonthIncome.toLocaleString('es-MX')} MXN
          </p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <DollarSign className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pagos Completados</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedPaymentsCount}</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Por Cobrar (Pendiente)</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            ${pendingAmount.toLocaleString('es-MX')} MXN
          </p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Clock className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}