// components/locations/LocationsContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Search, Building2, Loader2 } from "lucide-react";
import { LocationCard } from "./LocationCard";
import { LocationModal } from "./LocationModal";
import { DeleteLocationModal } from "./DeleteLocationModal";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  LocationFormData,
} from "@/app/actions/locations";

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  contactPhone?: string;
  rentType: "FIXED" | "HOURLY" | "PERCENTAGE" | "FREE";
  rentCost: string;
  capacity: number;
  amenities: string[];
  schedules: { id: string; name: string; time: string }[];
}

export function LocationsContent() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modales y Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(
    null,
  );
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(
    null,
  );

  // Cargar sedes desde Supabase al montar el componente
  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenCreateModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setIsModalOpen(true);
  };

  const handleSaveLocation = async (data: LocationFormData) => {
    if (editingLocation) {
      const res = await updateLocation(editingLocation.id, data);
      if (res.success) toast.success("Sede actualizada correctamente");
    } else {
      const res = await createLocation(data);
      if (res.success) toast.success("Nueva sede registrada con éxito");
    }
    await loadData();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingLocation) {
      const res = await deleteLocation(deletingLocation.id);
      if (res.success) {
        toast.success("Sede eliminada");
      } else {
        toast.error("No se pudo eliminar la sede");
      }
      await loadData();
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
            Administra tus sedes, esquemas de renta, capacidad y talleres
            asignados.
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

      {/* Cargando o Lista de Sedes */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando sedes desde Supabase...</p>
        </div>
      ) : filteredLocations.length > 0 ? (
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
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700">
            No hay sedes registradas
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Haz clic en "Nueva Sede" para agregar tu primer lugar de clases.
          </p>
        </div>
      )}

      {/* Modales */}
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
