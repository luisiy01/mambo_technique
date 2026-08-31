// components/schedules/SchedulesContent.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { ScheduleMetrics } from './ScheduleMetrics';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleModal } from './ScheduleModal';
import { DeleteScheduleModal } from './DeleteScheduleModal';

export interface ClassScheduleItem {
  id: string;
  className: string;
  locationName: string;
  days: string[];
  startTime: string;
  endTime: string;
  level: string;
  maxCapacity: number;
  enrolledLeaders: number;
  enrolledFollowers: number;
  instructor: string;
}

const INITIAL_SCHEDULES: ClassScheduleItem[] = [
  {
    id: 'sc1',
    className: 'Mambo On2 Intermedios',
    locationName: 'Estudio Central Mambo',
    days: ['Lunes', 'Miércoles'],
    startTime: '19:00',
    endTime: '20:30',
    level: 'Intermedio',
    maxCapacity: 25,
    enrolledLeaders: 8,
    enrolledFollowers: 10,
    instructor: 'Luis Fernando',
  },
  {
    id: 'sc2',
    className: 'Pachanga & Estilo Rítmico',
    locationName: 'Estudio Central Mambo',
    days: ['Viernes'],
    startTime: '18:00',
    endTime: '19:30',
    level: 'Intermedio',
    maxCapacity: 20,
    enrolledLeaders: 5,
    enrolledFollowers: 7,
    instructor: 'Luis Fernando',
  },
  {
    id: 'sc3',
    className: 'Salsa Casino / Timba',
    locationName: 'Academia Ritmo Norte',
    days: ['Martes', 'Jueves'],
    startTime: '20:00',
    endTime: '21:30',
    level: 'Principiante',
    maxCapacity: 18,
    enrolledLeaders: 6,
    enrolledFollowers: 6,
    instructor: 'Luis Fernando',
  },
];

const AVAILABLE_LOCATIONS = [
  'Estudio Central Mambo',
  'Academia Ritmo Norte',
  'Salón Cultural',
];

export function SchedulesContent() {
  const [schedules, setSchedules] = useState<ClassScheduleItem[]>(INITIAL_SCHEDULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassScheduleItem | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<ClassScheduleItem | null>(null);

  const filteredSchedules = schedules.filter((sc) => {
    const matchesSearch =
      sc.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'ALL' || sc.days.includes(selectedDay);
    return matchesSearch && matchesDay;
  });

  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sc: ClassScheduleItem) => {
    setEditingSchedule(sc);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (data: Omit<ClassScheduleItem, 'id' | 'enrolledLeaders' | 'enrolledFollowers'>) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === editingSchedule.id ? { ...item, ...data } : item))
      );
    } else {
      const newSchedule: ClassScheduleItem = {
        id: `sc_${Date.now()}`,
        ...data,
        enrolledLeaders: 0,
        enrolledFollowers: 0,
      };
      setSchedules((prev) => [...prev, newSchedule]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingSchedule) {
      setSchedules((prev) => prev.filter((sc) => sc.id !== deletingSchedule.id));
      setDeletingSchedule(null);
    }
  };

  const totalClasses = schedules.length;
  const totalWeeklyHours = schedules.reduce((sum, item) => sum + (item.days.length * 1.5), 0);
  const totalStudentsEnrolled = schedules.reduce(
    (sum, item) => sum + item.enrolledLeaders + item.enrolledFollowers,
    0
  );

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-indigo-600" />
            Horarios y Clases
          </h2>
          <p className="text-slate-500 text-sm">
            Organización de la agenda semanal, asignación de sedes y control de balance por clase.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Clase
        </button>
      </div>

      {/* Métricas */}
      <ScheduleMetrics
        totalClasses={totalClasses}
        totalWeeklyHours={totalWeeklyHours}
        totalStudentsEnrolled={totalStudentsEnrolled}
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por taller o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Filtrar por Día:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos los días</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>
      </div>

      {/* Lista de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.map((sc) => (
          <ScheduleCard
            key={sc.id}
            schedule={sc}
            onEdit={handleOpenEditModal}
            onDelete={(item) => setDeletingSchedule(item)}
          />
        ))}
      </div>

      {/* Modales */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        initialData={editingSchedule}
        availableLocations={AVAILABLE_LOCATIONS}
      />

      <DeleteScheduleModal
        classNameTitle={deletingSchedule?.className || null}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}