// components/schedules/ScheduleModal.tsx
import React, { useState, useEffect } from 'react';
import { ClassScheduleItem } from './SchedulesContent';
import { ScheduleFormData } from '../../actions/schedules';

export interface LocationOption {
  id: string;
  name: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleFormData) => void;
  initialData?: ClassScheduleItem | null;
  availableLocations: LocationOption[];
}

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function ScheduleModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  availableLocations 
}: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    className: '',
    locationId: availableLocations[0]?.id || '',
    days: ['Lunes', 'Miércoles'],
    startTime: '19:00',
    endTime: '20:30',
    level: 'Intermedio',
    maxCapacity: 20,
    instructor: 'Luis Fernando',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className,
        locationId: initialData.locationId,
        days: initialData.days,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        level: initialData.level,
        maxCapacity: initialData.maxCapacity,
        instructor: initialData.instructor,
      });
    } else {
      setFormData({
        className: '',
        locationId: availableLocations[0]?.id || '',
        days: ['Lunes', 'Miércoles'],
        startTime: '19:00',
        endTime: '20:30',
        level: 'Intermedio',
        maxCapacity: 20,
        instructor: 'Luis Fernando',
      });
    }
  }, [initialData, isOpen, availableLocations]);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.days.length === 0 || !formData.locationId) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {initialData ? `Editar Horario: ${formData.className}` : 'Programar Nueva Clase'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Taller / Estilo</label>
            <input
              required
              type="text"
              placeholder="ej. Mambo On2 (Tumbao & Estilo)"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sede / Lugar</label>
            <select
              required
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="" disabled>Selecciona una sede...</option>
              {availableLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Días Impartidos</label>
            <div className="flex flex-wrap gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = formData.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hora Inicio</label>
              <input
                required
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hora Fin</label>
              <input
                required
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cupo Máximo</label>
              <input
                type="number"
                min={5}
                max={50}
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Profesor / Instructor</label>
            <input
              type="text"
              placeholder="ej. Luis Fernando"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={availableLocations.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
            >
              {initialData ? 'Guardar Cambios' : 'Guardar Clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}