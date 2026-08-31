// components/locations/LocationsContent.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { LocationCard } from './LocationCard';
import { LocationModal } from './LocationModal';
import { DeleteLocationModal } from './DeleteLocationModal';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  contactPhone?: string;
  rentType: 'FIXED' | 'HOURLY' | 'PERCENTAGE' | 'FREE';
  rentCost: string;
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
  
  // Modales y Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(null);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setIsModalOpen(true);
  };

  const handleSaveLocation = (data: Omit<LocationItem, 'id' | 'schedules'>) => {
    if (editingLocation) {
      setLocations(prev =>
        prev.map(loc => loc.id === editingLocation.id ? { ...loc, ...data } : loc)
      );
    } else {
      const newLoc: LocationItem = {
        id: Date.now().toString(),
        ...data,
        schedules: []
      };
      setLocations(prev => [...prev, newLoc]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingLocation) {
      setLocations(prev => prev.filter(loc => loc.id !== deletingLocation.id));
      setDeletingLocation(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
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
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Sede
        </button>
      </div>

      {/* Buscador */}
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

      {/* Lista de Sedes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            onEdit={handleOpenEditModal}
            onDelete={(l) => setDeletingLocation(l)}
          />
        ))}
      </div>

      {/* Modales desacoplados */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLocation}
        initialData={editingLocation}
      />

      <DeleteLocationModal
        locationName={deletingLocation?.name || null}
        onClose={() => setDeletingLocation(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}