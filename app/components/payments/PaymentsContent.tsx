// components/payments/PaymentsContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import {
  Plus,
  Search,
  CreditCard,
  Loader2,
  Calendar,
  Download,
} from "lucide-react";
import { exportToCsv } from "../../lib/exportCsv";
import { PaymentMetrics } from "./PaymentMetrics";
import { PaymentTable } from "./PaymentTable";
import { PaymentModal, StudentOption } from "./PaymentModal";
import {
  getPayments,
  createPayment,
  PaymentFormData,
} from "../../actions/payments";
import { getStudents } from "../../actions/students";

export interface PaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  concept: string;
  amount: number;
  date: string;
  paymentMethod: "CASH" | "TRANSFER" | "CARD";
  status: "COMPLETED" | "PENDING" | "CANCELLED";
}

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export function PaymentsContent() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [students, setStudents] = useState<StudentOption[]>([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Estado para Mes y Año seleccionados (Inicializa con la fecha actual)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getUTCMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getUTCFullYear(),
  );

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
      setStudents(
        studentsData.map((s) => ({ id: s.id, fullName: s.fullName })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    loadData(newMonth, selectedYear);
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    loadData(selectedMonth, newYear);
  };

  // Filtrado dinámico en la tabla según buscador, estatus y periodo seleccionado
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    // Filtrar en la tabla los pagos que coincidan con el mes y año elegidos
    const paymentDate = new Date(p.date);
    const matchesMonth = paymentDate.getUTCMonth() + 1 === selectedMonth;
    const matchesYear = paymentDate.getUTCFullYear() === selectedYear;

    return matchesSearch && matchesStatus && matchesMonth && matchesYear;
  });

  const handleSavePayment = async (data: PaymentFormData) => {
  const res = await createPayment(data);
  if (res.success) {
    toast.success('Pago registrado con éxito', {
      description: `Se ha generado el recibo por $${data.amount} MXN.`,
    });
    await loadData(selectedMonth, selectedYear);
    setIsModalOpen(false);
  } else {
    toast.error('Error al registrar el pago', {
      description: res.error,
    });
  }
};

  if (!mounted) {
    return (
      <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Cargando módulo...</p>
      </main>
    );
  }

  const completedPaymentsCount = filteredPayments.filter(
    (p) => p.status === "COMPLETED",
  ).length;
  const pendingAmount = filteredPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  // Lista de últimos 3 años disponibles
  const currentYearNum = new Date().getFullYear();
  const availableYears = [
    currentYearNum - 1,
    currentYearNum,
    currentYearNum + 1,
  ];

  const handleExportFinancialReport = () => {
    if (filteredPayments.length === 0) return;

    const columns = [
      { header: "ID Transacción", accessor: (p: PaymentItem) => p.id },
      { header: "Alumno", accessor: (p: PaymentItem) => p.studentName },
      { header: "Concepto", accessor: (p: PaymentItem) => p.concept },
      { header: "Monto (MXN)", accessor: (p: PaymentItem) => p.amount },
      { header: "Fecha", accessor: (p: PaymentItem) => p.date },
      {
        header: "Método de Pago",
        accessor: (p: PaymentItem) =>
          p.paymentMethod === "TRANSFER"
            ? "SPEI / Transferencia"
            : p.paymentMethod === "CASH"
              ? "Efectivo"
              : "Tarjeta",
      },
      {
        header: "Estatus",
        accessor: (p: PaymentItem) =>
          p.status === "COMPLETED" ? "Completado" : "Pendiente",
      },
    ];

    const monthName =
      MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
    exportToCsv(
      filteredPayments,
      columns,
      `Reporte_Financiero_${monthName}_${selectedYear}`,
    );
    toast.info('Reporte generado', {
    description: 'La descarga del archivo CSV ha comenzado.',
  });
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-indigo-600" />
            Control de Pagos y Finanzas
          </h2>
          <p className="text-slate-500 text-sm">
            Registro de colegiaturas, comprobantes de pago e historial
            financiero.
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

      {/* Selector de Mes y Año */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Periodo Consultado:</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Métricas Financieras del Mes y Año Seleccionados */}
      <PaymentMetrics
        totalMonthIncome={monthlyIncome}
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
          <span className="text-xs text-slate-500 font-medium shrink-0">
            Filtrar Estatus:
          </span>
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

      {/* Tabla del Historial Filtrada */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando historial financiero...</p>
        </div>
      ) : (
        <PaymentTable payments={filteredPayments} />
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
