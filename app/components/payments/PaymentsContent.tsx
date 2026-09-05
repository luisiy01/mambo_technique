// components/payments/PaymentsContent.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CreditCard, 
  Loader2, 
  Calendar, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { PaymentMetrics } from './PaymentMetrics';
import { PaymentTable } from './PaymentTable';
import { PaymentModal, StudentOption } from './PaymentModal';
import { getPayments, createPayment, PaymentFormData } from '../../actions/payments';
import { getStudents } from '../../actions/students';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

export interface PaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  concept: string;
  amount: number;
  date: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD';
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export function PaymentsContent() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [students, setStudents] = useState<StudentOption[]>([]);
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  
  // Estado para Mes y Año seleccionados (Inicializa con la fecha actual)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getUTCMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getUTCFullYear());

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async (month?: number, year?: number) => {
    setIsLoading(true);
    try {
      const targetMonth = month !== undefined ? month : selectedMonth;
      const targetYear = year !== undefined ? year : selectedYear;

      const [paymentsData, studentsData] = await Promise.all([
        getPayments(targetMonth, targetYear),
        getStudents(),
      ]);

      setPayments(paymentsData.payments);
      setMonthlyIncome(paymentsData.monthlyIncome);
      setStudents(studentsData.map((s) => ({ id: s.id, fullName: s.fullName })));
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar datos financieros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  // Reiniciar a la página 1 cuando cambie cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, methodFilter, selectedMonth, selectedYear, pageSize]);

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    loadData(newMonth, selectedYear);
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    loadData(selectedMonth, newYear);
  };

  // Filtrado dinámico combinado en la tabla
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.concept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;
      
      // Filtrar los pagos que coincidan con el mes y año elegidos
      const paymentDate = new Date(p.date);
      const matchesMonth = (paymentDate.getUTCMonth() + 1) === selectedMonth;
      const matchesYear = paymentDate.getUTCFullYear() === selectedYear;

      return matchesSearch && matchesStatus && matchesMethod && matchesMonth && matchesYear;
    });
  }, [payments, searchTerm, statusFilter, methodFilter, selectedMonth, selectedYear]);

  // Cálculo de Paginación
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPayments.slice(startIndex, startIndex + pageSize);
  }, [filteredPayments, currentPage, pageSize]);

  const handleSavePayment = async (data: PaymentFormData) => {
    const res = await createPayment(data);
    if (res.success) {
      toast.success('Pago registrado con éxito', {
        description: `Se ha registrado el cobro de $${data.amount} MXN.`,
      });
      await loadData(selectedMonth, selectedYear);
      setIsModalOpen(false);
    } else {
      toast.error('Error al registrar el pago', {
        description: res.error,
      });
    }
  };

  const handleExportFinancialReport = () => {
    if (filteredPayments.length === 0) return;

    const columns = [
      { header: 'ID Transacción', accessor: (p: PaymentItem) => p.id },
      { header: 'Alumno', accessor: (p: PaymentItem) => p.studentName },
      { header: 'Concepto', accessor: (p: PaymentItem) => p.concept },
      { header: 'Monto (MXN)', accessor: (p: PaymentItem) => p.amount },
      { header: 'Fecha', accessor: (p: PaymentItem) => p.date },
      { 
        header: 'Método de Pago', 
        accessor: (p: PaymentItem) => 
          p.paymentMethod === 'TRANSFER' ? 'SPEI / Transferencia' : p.paymentMethod === 'CASH' ? 'Efectivo' : 'Tarjeta' 
      },
      { 
        header: 'Estatus', 
        accessor: (p: PaymentItem) => p.status === 'COMPLETED' ? 'Completado' : 'Pendiente' 
      },
    ];

    const monthName = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
    exportToCsv(filteredPayments, columns, `Reporte_Financiero_${monthName}_${selectedYear}`);
    toast.info('Reporte generado', {
      description: 'La descarga del archivo CSV ha comenzado.',
    });
  };

  if (!mounted) {
    return (
      <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Cargando módulo...</p>
      </main>
    );
  }

  const completedPaymentsCount = filteredPayments.filter((p) => p.status === 'COMPLETED').length;
  const pendingAmount = filteredPayments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const currentYearNum = new Date().getFullYear();
  const availableYears = [currentYearNum - 1, currentYearNum, currentYearNum + 1];

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFinancialReport}
            disabled={filteredPayments.length === 0}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors text-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Exportar Excel / CSV
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Registrar Pago
          </button>
        </div>
      </div>

      {/* Métricas Financieras del Mes y Año Seleccionados */}
      <PaymentMetrics
        totalMonthIncome={monthlyIncome}
        completedPaymentsCount={completedPaymentsCount}
        pendingAmount={pendingAmount}
      />

      {/* Panel de Filtros Combinados Avanzados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Filtros de Búsqueda Financiera</span>
          </div>

          {/* Selector de Mes y Año */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Buscador general */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por alumno o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Filtro por Método de Pago */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos los métodos de pago</option>
              <option value="TRANSFER">Transferencia / SPEI</option>
              <option value="CASH">Efectivo</option>
              <option value="CARD">Tarjeta</option>
            </select>
          </div>

          {/* Filtro por Estatus */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos los estatus</option>
              <option value="COMPLETED">Completados</option>
              <option value="PENDING">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla del Historial Filtrada */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando historial financiero...</p>
        </div>
      ) : (
        <>
          <PaymentTable payments={paginatedPayments} />

          {/* Paginación */}
          {totalItems > 0 && (
            <div className="mt-4 bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Mostrando</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>de <strong>{totalItems}</strong> registros filtrados</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium mr-2">
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayment}
        students={students}
      />
    </main>
  );
}