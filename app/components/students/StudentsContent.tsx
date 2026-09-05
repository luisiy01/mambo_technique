// components/students/StudentsContent.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Users, Loader2, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentMetrics } from './StudentMetrics';
import { StudentTable } from './StudentTable';
import { StudentModal, ScheduleOption } from './StudentModal';
import { DeleteStudentModal } from './DeleteStudentModal';
import { 
  getStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  StudentFormData 
} from '../../actions/students';
import { getSchedules } from '../../actions/schedules';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

export interface StudentItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  danceRole: 'LEADER' | 'FOLLOWER' | 'BOTH';
  level: string;
  scheduleId?: string;
  assignedClass: string;
  paymentStatus: 'PAID' | 'PENDING' | 'DUE_SOON';
  paymentDueDate: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export function StudentsContent() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [scheduleFilter, setScheduleFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentItem | null>(null);

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
        }))
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

  // Reiniciar a la página 1 cuando cambie cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, scheduleFilter, paymentFilter, pageSize]);

  // Aplicación combinada de todos los filtros
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchesSearch =
        st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.phone.includes(searchTerm) ||
        st.assignedClass.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'ALL' || st.danceRole === roleFilter;
      const matchesSchedule = scheduleFilter === 'ALL' || st.scheduleId === scheduleFilter;
      const matchesPayment = paymentFilter === 'ALL' || st.paymentStatus === paymentFilter;

      return matchesSearch && matchesRole && matchesSchedule && matchesPayment;
    });
  }, [students, searchTerm, roleFilter, scheduleFilter, paymentFilter]);

  // Cálculo de Paginación
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

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
      const res = await updateStudent(editingStudent.id, data);
      if (res.success) toast.success('Alumno actualizado con éxito');
    } else {
      const res = await createStudent(data);
      if (res.success) toast.success('Alumno registrado correctamente');
    }
    await loadData();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingStudent) {
      const res = await deleteStudent(deletingStudent.id);
      if (res.success) toast.success('Alumno eliminado del sistema');
      await loadData();
      setDeletingStudent(null);
    }
  };

  const handleExportStudents = () => {
    if (filteredStudents.length === 0) return;

    const columns = [
      { header: 'ID Alumno', accessor: (s: StudentItem) => s.id },
      { header: 'Nombre Completo', accessor: (s: StudentItem) => s.fullName },
      { header: 'Teléfono', accessor: (s: StudentItem) => s.phone },
      { header: 'Correo', accessor: (s: StudentItem) => s.email || 'N/A' },
      { 
        header: 'Rol de Baile', 
        accessor: (s: StudentItem) => s.danceRole === 'LEADER' ? 'Leader' : s.danceRole === 'FOLLOWER' ? 'Follower' : 'Ambos' 
      },
      { header: 'Nivel', accessor: (s: StudentItem) => s.level },
      { header: 'Taller Asignado', accessor: (s: StudentItem) => s.assignedClass },
      { 
        header: 'Estatus Pago', 
        accessor: (s: StudentItem) => s.paymentStatus === 'PAID' ? 'Al día' : s.paymentStatus === 'DUE_SOON' ? 'Por vencer' : 'Pendiente' 
      },
      { header: 'Estatus Alumno', accessor: (s: StudentItem) => s.status === 'ACTIVE' ? 'Activo' : 'Inactivo' },
    ];

    exportToCsv(filteredStudents, columns, `Padron_Alumnos_${new Date().toISOString().split('T')[0]}`);
    toast.info('Exportación iniciada', { description: 'Se ha generado el archivo CSV de alumnos.' });
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
  const active = students.filter((s) => s.status === 'ACTIVE').length;
  const pendingPayment = students.filter((s) => s.paymentStatus === 'PENDING').length;

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-600" />
            Gestión de Alumnos
          </h2>
          <p className="text-slate-500 text-sm">
            Control de estudiantes, roles de baile, asignación de talleres y estatus de colegiaturas.
          </p>
        </div>

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
      </div>

      {/* Métricas Rápidas */}
      <StudentMetrics total={total} active={active} pendingPayment={pendingPayment} />

      {/* Panel de Filtros Combinados Avanzados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-indigo-600" />
          <span>Filtros de Búsqueda Avanzada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Buscador general */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nombre, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Filtro por Rol */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos los roles</option>
              <option value="LEADER">Leader (Guía)</option>
              <option value="FOLLOWER">Follower (Sigue)</option>
              <option value="BOTH">Ambos Roles</option>
            </select>
          </div>

          {/* Filtro por Taller / Clase */}
          <div>
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todas las clases / talleres</option>
              {schedules.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estatus de Pago */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos los estatus de pago</option>
              <option value="PAID">Al día (Pagado)</option>
              <option value="DUE_SOON">Próximo a vencer</option>
              <option value="PENDING">Pendiente / Vencido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando alumnos desde Supabase...</p>
        </div>
      ) : (
        <>
          <StudentTable
            students={paginatedStudents}
            onEdit={handleOpenEdit}
            onDelete={(st) => setDeletingStudent(st)}
          />

          {/* Barra de Paginación */}
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
                <span>de <strong>{totalItems}</strong> alumnos filtrados</span>
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