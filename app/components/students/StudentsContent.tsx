// components/students/StudentsContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, Loader2, Download } from "lucide-react";
import { StudentMetrics } from "./StudentMetrics";
import { StudentTable } from "./StudentTable";
import { StudentModal, ScheduleOption } from "./StudentModal";
import { DeleteStudentModal } from "./DeleteStudentModal";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  StudentFormData,
} from "../../actions/students";
import { getSchedules } from "../../actions/schedules";
import { exportToCsv } from "../../lib/exportCsv";

export interface StudentItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  danceRole: "LEADER" | "FOLLOWER" | "BOTH";
  level: string;
  scheduleId?: string;
  assignedClass: string;
  paymentStatus: "PAID" | "PENDING" | "DUE_SOON";
  paymentDueDate: number;
  status: "ACTIVE" | "INACTIVE";
}

export function StudentsContent() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(
    null,
  );
  const [deletingStudent, setDeletingStudent] = useState<StudentItem | null>(
    null,
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [studentsData, schedulesData] = await Promise.all([
        getStudents(),
        getSchedules(),
      ]);
      setStudents(studentsData);
      setSchedules(
        schedulesData.map((s) => ({
          id: s.id,
          label: `${s.className} (${s.locationName})`,
        })),
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

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.assignedClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || st.danceRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: StudentItem) => {
    setEditingStudent(st);
    setIsModalOpen(true);
  };

  const handleSave = async (data: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await createStudent(data);
    }
    await loadData();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingStudent) {
      await deleteStudent(deletingStudent.id);
      await loadData();
      setDeletingStudent(null);
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

  const total = students.length;
  const active = students.filter((s) => s.status === "ACTIVE").length;
  const pendingPayment = students.filter(
    (s) => s.paymentStatus === "PENDING",
  ).length;

  const handleExportStudents = () => {
    if (filteredStudents.length === 0) return;

    const columns = [
      { header: "ID Alumno", accessor: (s: StudentItem) => s.id },
      { header: "Nombre Completo", accessor: (s: StudentItem) => s.fullName },
      { header: "Teléfono", accessor: (s: StudentItem) => s.phone },
      { header: "Correo", accessor: (s: StudentItem) => s.email || "N/A" },
      {
        header: "Rol de Baile",
        accessor: (s: StudentItem) =>
          s.danceRole === "LEADER"
            ? "Leader"
            : s.danceRole === "FOLLOWER"
              ? "Follower"
              : "Ambos",
      },
      { header: "Nivel", accessor: (s: StudentItem) => s.level },
      {
        header: "Taller Asignado",
        accessor: (s: StudentItem) => s.assignedClass,
      },
      {
        header: "Estatus Pago",
        accessor: (s: StudentItem) =>
          s.paymentStatus === "PAID"
            ? "Al día"
            : s.paymentStatus === "DUE_SOON"
              ? "Por vencer"
              : "Pendiente",
      },
      {
        header: "Estatus Alumno",
        accessor: (s: StudentItem) =>
          s.status === "ACTIVE" ? "Activo" : "Inactivo",
      },
    ];

    exportToCsv(
      filteredStudents,
      columns,
      `Padron_Alumnos_${new Date().toISOString().split("T")[0]}`,
    );
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportStudents}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors text-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Exportar Alumnos
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Alumno
          </button>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Alumno
        </button>
      </div>

      {/* Métricas Rápidas */}
      <StudentMetrics
        total={total}
        active={active}
        pendingPayment={pendingPayment}
      />

      {/* Filtros y Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o clase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">
            Filtrar por Rol:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos los roles</option>
            <option value="LEADER">Leader (Guía)</option>
            <option value="FOLLOWER">Follower (Sigue)</option>
            <option value="BOTH">Ambos</option>
          </select>
        </div>
      </div>

      {/* Cargando o Tabla Principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando alumnos desde Supabase...</p>
        </div>
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleOpenEdit}
          onDelete={(st) => setDeletingStudent(st)}
        />
      )}

      {/* Modales */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingStudent}
        availableSchedules={schedules}
      />

      <DeleteStudentModal
        studentName={deletingStudent?.fullName || null}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
