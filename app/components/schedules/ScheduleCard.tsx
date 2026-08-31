// components/schedules/ScheduleCard.tsx
import React from 'react';
import { MapPin, Clock, Users, Pencil, Trash2 } from 'lucide-react';
import { ClassScheduleItem } from './SchedulesContent';

interface ScheduleCardProps {
  schedule: ClassScheduleItem;
  onEdit: (item: ClassScheduleItem) => void;
  onDelete: (item: ClassScheduleItem) => void;
}

export function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'principiante':
        return 'bg-emerald-100 text-emerald-800';
      case 'intermedio':
        return 'bg-blue-100 text-blue-800';
      case 'avanzado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Header de la tarjeta */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-snug">{schedule.className}</h3>
            <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getLevelBadgeColor(schedule.level)}`}>
              {schedule.level}
            </span>
          </div>
          
          <button
            onClick={() => onDelete(schedule)}
            title="Eliminar clase"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Info de Sede y Horarios */}
        <div className="space-y-2 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-slate-800">{schedule.locationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
            <span>
              <strong className="text-slate-700">{schedule.days.join(', ')}</strong> • {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        </div>

        {/* Balance Leader / Follower y Cupo */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-emerald-500" /> Alumnos Inscritos
            </span>
            <span className="font-bold text-slate-900">
              {schedule.enrolledLeaders + schedule.enrolledFollowers} / {schedule.maxCapacity}
            </span>
          </div>

          {/* Barras de proporción Leader / Follower */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
            <div className="flex justify-between items-center text-blue-700 font-medium">
              <span>Leaders:</span>
              <span className="font-bold">{schedule.enrolledLeaders}</span>
            </div>
            <div className="flex justify-between items-center text-purple-700 font-medium">
              <span>Followers:</span>
              <span className="font-bold">{schedule.enrolledFollowers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Profesor: {schedule.instructor}</span>
        <button
          onClick={() => onEdit(schedule)}
          className="inline-flex items-center gap-1 text-slate-600 font-medium hover:text-indigo-600 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar Horario
        </button>
      </div>
    </div>
  );
}