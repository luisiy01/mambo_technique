// components/payments/PaymentTable.tsx
import React from 'react';
import { PaymentItem } from './PaymentsContent';
import { DownloadReceiptButton } from './DownloadReceiptButton';

interface PaymentTableProps {
  payments: PaymentItem[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold">
              <th className="py-3 px-4">Alumno</th>
              <th className="py-3 px-4">Concepto</th>
              <th className="py-3 px-4">Monto</th>
              <th className="py-3 px-4">Método</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Estatus</th>
              <th className="py-3 px-4 text-center">Recibo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.studentName}</td>
                  <td className="py-3 px-4 font-medium">{p.concept}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    ${p.amount.toLocaleString('es-MX')} MXN
                  </td>
                  <td className="py-3 px-4">
                    {p.paymentMethod === 'TRANSFER'
                      ? 'SPEI / Transf.'
                      : p.paymentMethod === 'CASH'
                      ? 'Efectivo'
                      : 'Tarjeta'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{p.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.status === 'COMPLETED' ? (
                      <div className="flex justify-center">
                        <DownloadReceiptButton payment={p} />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No hay pagos registrados para este periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}