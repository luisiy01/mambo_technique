// components/students/StudentModal.tsx
import React, { useState, useEffect } from 'react';
import { StudentItem } from './StudentsContent';
import { StudentFormData } from '../../actions/students';

export interface ScheduleOption {
  id: string;
  label: string;
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  initialData?: StudentItem | null;
  availableSchedules: ScheduleOption[];
}

export function StudentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  availableSchedules 
}: StudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    phone: '',
    email: '',
    danceRole: 'FOLLOWER',
    level: 'Principiante',
    scheduleId: availableSchedules[0]?.id || '',
    paymentStatus: 'PAID',
    paymentDueDate: 5,
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        phone: initialData.phone,
        email: initialData.email || '',
        danceRole: initialData.danceRole,
        level: initialData.level,
        scheduleId: initialData.scheduleId || '',
        paymentStatus: initialData.paymentStatus,
        paymentDueDate: initialData.paymentDueDate,
        status: initialData.status,
      });
    } else {
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        danceRole: 'FOLLOWER',
        level: 'Principiante',
        scheduleId: availableSchedules[0]?.id || '',
        paymentStatus: 'PAID',
        paymentDueDate: 5,
        status: 'ACTIVE',
      });
    }
  }, [initialData, isOpen, availableSchedules]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {initialData ? `Editar Alumno: ${formData.fullName}` : 'Registrar Nuevo Alumno'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              required
              type="text"
              placeholder="ej. María García"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
              <input
                required
                type="text"
                placeholder="+52 312 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rol de Baile</label>
              <select
                value={formData.danceRole}
                onChange={(e) => setFormData({ ...formData, danceRole: e.target.value as StudentFormData['danceRole'] })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="LEADER">Leader (Guía)</option>
                <option value="FOLLOWER">Follower (Sigue)</option>
                <option value="BOTH">Ambos Roles</option>
              </select>
            </div>
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clase Asignada</label>
            <select
              value={formData.scheduleId || ''}
              onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Sin clase asignada</option>
              {availableSchedules.map((sch) => (
                <option key={sch.id} value={sch.id}>{sch.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estatus del Pago</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as StudentFormData['paymentStatus'] })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="PAID">Al día (Pagado)</option>
                <option value="DUE_SOON">Próximo a vencer</option>
                <option value="PENDING">Pendiente / Vencido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Día Límite de Pago</label>
              <input
                type="number"
                min={1}
                max={31}
                value={formData.paymentDueDate}
                onChange={(e) => setFormData({ ...formData, paymentDueDate: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {initialData ? 'Guardar Cambios' : 'Registrar Alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}