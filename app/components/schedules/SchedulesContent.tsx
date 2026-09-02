// components/schedules/SchedulesContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Loader2 } from 'lucide-react';
import { ScheduleMetrics } from './ScheduleMetrics';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleModal, LocationOption } from './ScheduleModal';
import { DeleteScheduleModal } from './DeleteScheduleModal';
import { 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  ScheduleFormData 
} from '../../actions/schedules';
import { getLocations } from '../../actions/locations';

export interface ClassScheduleItem {
  id: string;
  className: string;
  locationId: string;
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

export function SchedulesContent() {
  const [schedules, setSchedules] = useState<ClassScheduleItem[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassScheduleItem | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<ClassScheduleItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [schedulesData, locationsData] = await Promise.all([
        getSchedules(),
        getLocations(),
      ]);
      setSchedules(schedulesData);
      setLocations(locationsData.map((l) => ({ id: l.id, name: l.name })));
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

  const handleSaveSchedule = async (data: ScheduleFormData) => {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, data);
    } else {
      await createSchedule(data);
    }
    await loadData();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingSchedule) {
      await deleteSchedule(deletingSchedule.id);
      await loadData();
      setDeletingSchedule(null);
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

  const totalClasses = schedules.length;
  const totalWeeklyHours = schedules.reduce((sum, item) => sum + item.days.length, 0);
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

      {/* Cargando o Lista de Tarjetas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando horarios desde Supabase...</p>
        </div>
      ) : filteredSchedules.length > 0 ? (
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
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700">No hay horarios registrados</h3>
          <p className="text-xs text-slate-400 mt-1">Haz clic en "Nueva Clase" para crear tu primer taller.</p>
        </div>
      )}

      {/* Modales */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        initialData={editingSchedule}
        availableLocations={locations}
      />

      <DeleteScheduleModal
        classNameTitle={deletingSchedule?.className || null}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}