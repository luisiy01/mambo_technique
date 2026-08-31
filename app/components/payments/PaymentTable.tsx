// components/payments/PaymentTable.tsx
import React from 'react';
import { CreditCard, Banknote, ArrowUpRight } from 'lucide-react';
import { PaymentItem } from './PaymentsContent';

interface PaymentTableProps {
  payments: PaymentItem[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const getStatusBadge = (status: PaymentItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">Completado</span>;
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold">Pendiente</span>;
      case 'CANCELLED':
        return <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-semibold">Cancelado</span>;
    }
  };

  const getMethodBadge = (method: PaymentItem['paymentMethod']) => {
    switch (method) {
      case 'CASH':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
            <Banknote className="h-3.5 w-3.5 text-emerald-600" /> Efectivo
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" /> Transferencia
          </span>
        );
      case 'CARD':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
            <CreditCard className="h-3.5 w-3.5 text-purple-600" /> Tarjeta
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <th className="py-3.5 px-4">Alumno</th>
              <th className="py-3.5 px-4">Concepto</th>
              <th className="py-3.5 px-4">Monto</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-4">Método</th>
              <th className="py-3.5 px-4 text-right">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{payment.studentName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-slate-700">{payment.concept}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">
                      ${payment.amount.toLocaleString('es-MX')} MXN
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{payment.date}</td>
                  <td className="py-3.5 px-4">{getMethodBadge(payment.paymentMethod)}</td>
                  <td className="py-3.5 px-4 text-right">{getStatusBadge(payment.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No se encontraron pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}