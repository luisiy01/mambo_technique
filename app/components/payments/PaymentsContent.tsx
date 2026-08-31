// components/payments/PaymentsContent.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Search, CreditCard } from 'lucide-react';
import { PaymentMetrics } from './PaymentMetrics';
import { PaymentTable } from './PaymentTable';
import { PaymentModal } from './PaymentModal';

export interface PaymentItem {
  id: string;
  studentName: string;
  concept: string;
  amount: number;
  date: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD';
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: 'p1',
    studentName: 'Ana Martínez',
    concept: 'Colegiatura Mensual - Mambo On2',
    amount: 800,
    date: '2026-08-28',
    paymentMethod: 'TRANSFER',
    status: 'COMPLETED',
  },
  {
    id: 'p2',
    studentName: 'Sofia López',
    concept: 'Inscripción + Colegiatura Salsa',
    amount: 1200,
    date: '2026-08-25',
    paymentMethod: 'CASH',
    status: 'COMPLETED',
  },
  {
    id: 'p3',
    studentName: 'Carlos Ruiz',
    concept: 'Colegiatura Mensual - Mambo On2',
    amount: 800,
    date: '2026-09-01',
    paymentMethod: 'TRANSFER',
    status: 'PENDING',
  },
];

export function PaymentsContent() {
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSavePayment = (data: Omit<PaymentItem, 'id'>) => {
    const newPayment: PaymentItem = {
      id: `p_${Date.now()}`,
      ...data,
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const totalMonthIncome = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedPaymentsCount = payments.filter((p) => p.status === 'COMPLETED').length;

  const pendingAmount = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-indigo-600" />
            Control de Pagos y Finanzas
          </h2>
          <p className="text-slate-500 text-sm">
            Registro de colegiaturas, comprobantes de pago e historial financiero.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Registrar Pago
        </button>
      </div>

      {/* Métricas Financieras */}
      <PaymentMetrics
        totalMonthIncome={totalMonthIncome}
        completedPaymentsCount={completedPaymentsCount}
        pendingAmount={pendingAmount}
      />

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alumno o concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Filtrar Estatus:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos los estatus</option>
            <option value="COMPLETED">Completados</option>
            <option value="PENDING">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Tabla de Historial */}
      <PaymentTable payments={filteredPayments} />

      {/* Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayment}
      />
    </main>
  );
}