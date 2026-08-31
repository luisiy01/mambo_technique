// components/locations/LocationModal.tsx
import React, { useState, useEffect } from 'react';
import { LocationItem } from './LocationsContent';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<LocationItem, 'id' | 'schedules'>) => void;
  initialData?: LocationItem | null;
}

export function LocationModal({ isOpen, onClose, onSave, initialData }: LocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPhone: '',
    rentType: 'FIXED' as LocationItem['rentType'],
    rentCost: '',
    capacity: 20,
    amenitiesInput: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        address: initialData.address,
        contactPhone: initialData.contactPhone || '',
        rentType: initialData.rentType,
        rentCost: initialData.rentCost,
        capacity: initialData.capacity,
        amenitiesInput: initialData.amenities.join(', '),
      });
    } else {
      setFormData({
        name: '',
        address: '',
        contactPhone: '',
        rentType: 'FIXED',
        rentCost: '',
        capacity: 20,
        amenitiesInput: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArray = formData.amenitiesInput
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    onSave({
      name: formData.name,
      address: formData.address,
      contactPhone: formData.contactPhone,
      rentType: formData.rentType,
      rentCost: formData.rentCost,
      capacity: Number(formData.capacity),
      amenities: amenitiesArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {initialData ? `Editar Sede: ${formData.name}` : 'Registrar Nueva Sede'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Lugar</label>
            <input
              required
              type="text"
              placeholder="ej. Estudio Central"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Completa</label>
            <input
              required
              type="text"
              placeholder="ej. Calle 123, Col. Centro"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                placeholder="ej. 312 000 0000"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacidad (Alumnos)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Esquema de Renta</label>
              <select
                value={formData.rentType}
                onChange={(e) => setFormData({ ...formData, rentType: e.target.value as LocationItem['rentType'] })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="FIXED">Renta Fija</option>
                <option value="HOURLY">Por Hora</option>
                <option value="PERCENTAGE">Porcentaje %</option>
                <option value="FREE">Sin Costo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle del Costo</label>
              <input
                type="text"
                placeholder="ej. $2,500 / mes"
                value={formData.rentCost}
                onChange={(e) => setFormData({ ...formData, rentCost: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Amenidades (Separadas por coma)</label>
            <input
              type="text"
              placeholder="Duela, Espejos, Aire Acondicionado"
              value={formData.amenitiesInput}
              onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {initialData ? 'Guardar Cambios' : 'Guardar Sede'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}