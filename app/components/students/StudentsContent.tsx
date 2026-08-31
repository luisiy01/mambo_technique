// components/students/StudentsContent.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { StudentMetrics } from './StudentMetrics';
import { StudentTable } from './StudentTable';
import { StudentModal } from './StudentModal';
import { DeleteStudentModal } from './DeleteStudentModal';

export interface StudentItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  danceRole: 'LEADER' | 'FOLLOWER' | 'BOTH';
  level: string;
  assignedClass: string;
  paymentStatus: 'PAID' | 'PENDING' | 'DUE_SOON';
  paymentDueDate: number; // Día del mes
  status: 'ACTIVE' | 'INACTIVE';
}

const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: '1',
    fullName: 'Ana Martínez',
    phone: '+52 312 111 2233',
    email: 'ana@example.com',
    danceRole: 'FOLLOWER',
    level: 'Intermedio',
    assignedClass: 'Mambo On2 - Estudio Central',
    paymentStatus: 'PAID',
    paymentDueDate: 5,
    status: 'ACTIVE',
  },
  {
    id: '2',
    fullName: 'Carlos Ruiz',
    phone: '+52 312 444 5566',
    danceRole: 'LEADER',
    level: 'Intermedio',
    assignedClass: 'Mambo On2 - Estudio Central',
    paymentStatus: 'PENDING',
    paymentDueDate: 1,
    status: 'ACTIVE',
  },
  {
    id: '3',
    fullName: 'Sofia López',
    phone: '+52 312 777 8899',
    danceRole: 'FOLLOWER',
    level: 'Principiante',
    assignedClass: 'Salsa Timba - Ritmo Norte',
    paymentStatus: 'DUE_SOON',
    paymentDueDate: 10,
    status: 'ACTIVE',
  },
];

export function StudentsContent() {
  const [students, setStudents] = useState<StudentItem[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentItem | null>(null);

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.assignedClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || st.danceRole === roleFilter;
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

  const handleSave = (data: Omit<StudentItem, 'id'>) => {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((item) => (item.id === editingStudent.id ? { ...item, ...data } : item))
      );
    } else {
      const newStudent: StudentItem = {
        id: Date.now().toString(),
        ...data,
      };
      setStudents((prev) => [...prev, newStudent]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingStudent) {
      setStudents((prev) => prev.filter((st) => st.id !== deletingStudent.id));
      setDeletingStudent(null);
    }
  };

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

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Alumno
        </button>
      </div>

      {/* Métricas Rápidas */}
      <StudentMetrics total={total} active={active} pendingPayment={pendingPayment} />

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
          <span className="text-xs text-slate-500 font-medium shrink-0">Filtrar por Rol:</span>
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

      {/* Tabla Principal */}
      <StudentTable
        students={filteredStudents}
        onEdit={handleOpenEdit}
        onDelete={(st) => setDeletingStudent(st)}
      />

      {/* Modales */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingStudent}
      />

      <DeleteStudentModal
        studentName={deletingStudent?.fullName || null}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}