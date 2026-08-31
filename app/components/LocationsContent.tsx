// components/LocationsContent.tsx
'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Users, 
  Clock, 
  DollarSign, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  Search,
  Building2
} from 'lucide-react';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  contactPhone?: string;
  rentType: 'FIXED' | 'HOURLY' | 'PERCENTAGE' | 'FREE';
  rentCost: string; // ej. "$3,000 / mes", "$200 / hr", "30% por alumno"
  capacity: number;
  amenities: string[];
  schedules: { id: string; name: string; time: string }[];
}

const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: '1',
    name: 'Estudio Central Mambo',
    address: 'Av. Revolución 450, Col. Centro',
    googleMapsUrl: 'https://maps.google.com',
    contactPhone: '+52 312 123 4567',
    rentType: 'FIXED',
    rentCost: '$3,500 MXN / mes',
    capacity: 25,
    amenities: ['Piso de Duela', 'Espejos', 'Aire Acondicionado', 'Audio Bluetooth'],
    schedules: [
      { id: 's1', name: 'Mambo On2 (Intermedios)', time: 'Lun y Mié - 19:00 a 20:30' },
      { id: 's2', name: 'Pachanga & Estilo', time: 'Vie - 18:00 a 19:30' }
    ]
  },
  {
    id: '2',
    name: 'Academia Ritmo Norte',
    address: 'Calle Hidalgo 120, Col. Jardines',
    googleMapsUrl: 'https://maps.google.com',
    contactPhone: '+52 312 987 6543',
    rentType: 'HOURLY',
    rentCost: '$250 MXN / hora',
    capacity: 18,
    amenities: ['Espejos', 'Equipo de Sonido'],
    schedules: [
      { id: 's3', name: 'Salsa Casino / Timba', time: 'Mar y Jue - 20:00 a 21:30' }
    ]
  },
  {
    id: '3',
    name: 'Salón Cultural',
    address: 'Av. Tecnológico 85',
    contactPhone: '+52 312 555 1122',
    rentType: 'PERCENTAGE',
    rentCost: '30% Comisión',
    capacity: 30,
    amenities: ['Piso Madera', 'Amplio Estacionamiento'],
    schedules: [
      { id: 's4', name: 'Cha Cha Cha & Musicalidad', time: 'Sáb - 11:00 a 13:00' }
    ]
  }
];

export function LocationsContent() {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPhone: '',
    rentType: 'FIXED' as LocationItem['rentType'],
    rentCost: '',
    capacity: 20,
    amenitiesInput: '',
  });

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: LocationItem = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      contactPhone: formData.contactPhone,
      rentType: formData.rentType,
      rentCost: formData.rentCost,
      capacity: Number(formData.capacity),
      amenities: formData.amenitiesInput.split(',').map(a => a.trim()).filter(Boolean),
      schedules: []
    };

    setLocations([...locations, newLoc]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      address: '',
      contactPhone: '',
      rentType: 'FIXED',
      rentCost: '',
      capacity: 20,
      amenitiesInput: '',
    });
  };

  const getRentBadgeColor = (type: LocationItem['rentType']) => {
    switch(type) {
      case 'FIXED': return 'bg-blue-100 text-blue-800';
      case 'HOURLY': return 'bg-amber-100 text-amber-800';
      case 'PERCENTAGE': return 'bg-purple-100 text-purple-800';
      case 'FREE': return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-7 w-7 text-indigo-600" />
            Lugares de Clases
          </h2>
          <p className="text-slate-500 text-sm">
            Administra tus sedes, esquemas de renta, capacidad y talleres asignados.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Sede
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid de Sedes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <div 
            key={loc.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
          >
            <div className="p-6">
              {/* Encabezado Tarjeta */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-900 leading-snug">{loc.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getRentBadgeColor(loc.rentType)}`}>
                  {loc.rentType === 'FIXED' && 'Renta Fija'}
                  {loc.rentType === 'HOURLY' && 'Por Hora'}
                  {loc.rentType === 'PERCENTAGE' && 'Comisión'}
                  {loc.rentType === 'FREE' && 'Sin Costo'}
                </span>
              </div>

              {/* Punto 1: Info Básica */}
              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>
                {loc.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{loc.contactPhone}</span>
                  </div>
                )}
              </div>

              {/* Punto 2 y 3: Costos y Capacidad */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg mb-4 border border-slate-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-indigo-500" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Costo</p>
                    <p className="text-xs font-bold text-slate-800">{loc.rentCost}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Cupo Máx.</p>
                    <p className="text-xs font-bold text-slate-800">{loc.capacity} Alumnos</p>
                  </div>
                </div>
              </div>

              {/* Punto 3: Amenidades / Equipamiento */}
              {loc.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Amenidades
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.amenities.map((item, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Punto 4: Clases / Horarios Asignados */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-500" /> Clases en esta Sede
                </p>
                {loc.schedules.length > 0 ? (
                  <ul className="space-y-1.5">
                    {loc.schedules.map((sch) => (
                      <li key={sch.id} className="text-xs bg-indigo-50/60 border border-indigo-100 p-2 rounded-lg">
                        <span className="font-semibold text-indigo-900 block">{sch.name}</span>
                        <span className="text-[11px] text-indigo-600">{sch.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No hay clases asignadas</p>
                )}
              </div>
            </div>

            {/* Acciones del Card */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {loc.googleMapsUrl ? (
                <a 
                  href={loc.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline"
                >
                  Ver en Maps <ExternalLink className="h-3 w-3" />
                </a>
              ) : <span />}
              <button className="text-slate-500 font-medium hover:text-slate-800">
                Editar Sede
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Formulario para Nueva Sede */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar Nueva Sede</h3>
            <form onSubmit={handleCreateLocation} className="space-y-4">
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Guardar Sede
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}