// components/locations/LocationCard.tsx
import React from 'react';
import { 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { LocationItem } from './LocationsContent';

interface LocationCardProps {
  location: LocationItem;
  onEdit: (location: LocationItem) => void;
  onDelete: (location: LocationItem) => void;
}

export function LocationCard({ location, onEdit, onDelete }: LocationCardProps) {
  const getRentBadgeColor = (type: LocationItem['rentType']) => {
    switch(type) {
      case 'FIXED': return 'bg-blue-100 text-blue-800';
      case 'HOURLY': return 'bg-amber-100 text-amber-800';
      case 'PERCENTAGE': return 'bg-purple-100 text-purple-800';
      case 'FREE': return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Encabezado Tarjeta */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-snug">{location.name}</h3>
            <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getRentBadgeColor(location.rentType)}`}>
              {location.rentType === 'FIXED' && 'Renta Fija'}
              {location.rentType === 'HOURLY' && 'Por Hora'}
              {location.rentType === 'PERCENTAGE' && 'Comisión'}
              {location.rentType === 'FREE' && 'Sin Costo'}
            </span>
          </div>
          
          <button
            onClick={() => onDelete(location)}
            title="Eliminar sede"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Info Básica */}
        <div className="space-y-2 text-xs text-slate-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{location.address}</span>
          </div>
          {location.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{location.contactPhone}</span>
            </div>
          )}
        </div>

        {/* Costo y Capacidad */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg mb-4 border border-slate-100">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Costo</p>
              <p className="text-xs font-bold text-slate-800">{location.rentCost}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Cupo Máx.</p>
              <p className="text-xs font-bold text-slate-800">{location.capacity} Alumnos</p>
            </div>
          </div>
        </div>

        {/* Amenidades */}
        {location.amenities.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Amenidades
            </p>
            <div className="flex flex-wrap gap-1.5">
              {location.amenities.map((item, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clases / Horarios */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Clock className="h-3 w-3 text-blue-500" /> Clases en esta Sede
          </p>
          {location.schedules.length > 0 ? (
            <ul className="space-y-1.5">
              {location.schedules.map((sch) => (
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

      {/* Pie de la tarjeta */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {location.googleMapsUrl ? (
          <a 
            href={location.googleMapsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline"
          >
            Ver en Maps <ExternalLink className="h-3 w-3" />
          </a>
        ) : <span />}
        <button 
          onClick={() => onEdit(location)}
          className="inline-flex items-center gap-1 text-slate-600 font-medium hover:text-indigo-600 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar Sede
        </button>
      </div>
    </div>
  );
}