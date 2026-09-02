// components/attendance/AttendanceContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Calendar, 
  Save, 
  Loader2, 
  Building2 
} from 'lucide-react';
import { AttendanceStatus } from '@prisma/client';
import { getSchedules } from '../../actions/schedules';
import { getClassAttendance, saveClassAttendance, AttendanceRecordInput } from '../../actions/attendance';

interface ScheduleOption {
  id: string;
  className: string;
  locationName: string;
}

interface StudentAttendanceItem {
  id: string;
  fullName: string;
  danceRole: 'LEADER' | 'FOLLOWER' | 'BOTH';
  attendanceStatus: AttendanceStatus;
}

export function AttendanceContent() {
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [scheduleDetails, setScheduleDetails] = useState<{ scheduleName: string; locationName: string; instructor: string } | null>(null);

  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Inicializar fecha actual en cliente
  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Cargar lista de clases disponibles
  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await getSchedules();
        const formatted = data.map((s) => ({
          id: s.id,
          className: s.className,
          locationName: s.locationName,
        }));
        setSchedules(formatted);
        if (formatted.length > 0) {
          setSelectedScheduleId(formatted[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSchedules(false);
      }
    }
    loadSchedules();
  }, []);

  // Cargar lista de alumnos cuando cambia la clase o la fecha
  const loadAttendanceList = async () => {
    if (!selectedScheduleId || !selectedDate) return;
    setIsLoadingStudents(true);
    setSaveSuccess(false);
    try {
      const data = await getClassAttendance(selectedScheduleId, selectedDate);
      setStudents(data.students);
      setScheduleDetails({
        scheduleName: data.scheduleName,
        locationName: data.locationName,
        instructor: data.instructor,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (mounted && selectedScheduleId && selectedDate) {
      loadAttendanceList();
    }
  }, [selectedScheduleId, selectedDate, mounted]);

  // Cambiar estatus de asistencia de un alumno de forma local
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  // Marcar todos como Presentes
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, attendanceStatus: 'PRESENT' })));
  };

  // Guardar en Supabase
  const handleSave = async () => {
    if (!selectedScheduleId || !selectedDate) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const records: AttendanceRecordInput[] = students.map((s) => ({
      studentId: s.id,
      status: s.attendanceStatus,
    }));

    const res = await saveClassAttendance(selectedScheduleId, selectedDate, records);
    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!mounted || isLoadingSchedules) {
    return (
      <main className="flex-1 p-8 flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Cargando tomador de asistencia...</p>
      </main>
    );
  }

  const presentCount = students.filter((s) => s.attendanceStatus === 'PRESENT').length;
  const lateCount = students.filter((s) => s.attendanceStatus === 'LATE').length;
  const absentCount = students.filter((s) => s.attendanceStatus === 'ABSENT').length;

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-indigo-600" />
            Pase de Lista y Asistencia
          </h2>
          <p className="text-slate-500 text-sm">
            Control diario de asistencia de alumnos por taller y fecha.
          </p>
        </div>

        {students.length > 0 && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors text-sm disabled:bg-slate-300"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Guardando...' : 'Guardar Asistencia'}
          </button>
        )}
      </div>

      {/* Alerta de Éxito */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ¡Pase de lista guardado correctamente en Supabase!
        </div>
      )}

      {/* Selectores de Clase y Fecha */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Seleccionar Taller / Clase
          </label>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {schedules.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.className} — {sc.locationName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Fecha de la Clase
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen Rápidos de Asistencia */}
      {students.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase">Presentes</span>
            <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{presentCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase">Retardos</span>
            <p className="text-xl font-extrabold text-amber-900 mt-0.5">{lateCount}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-rose-700 uppercase">Faltas</span>
            <p className="text-xl font-extrabold text-rose-900 mt-0.5">{absentCount}</p>
          </div>
        </div>
      )}

      {/* Lista de Alumnos */}
      {isLoadingStudents ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm">Cargando lista de alumnos...</p>
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              Sede: {scheduleDetails?.locationName} | Profesor: {scheduleDetails?.instructor}
            </div>
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline"
            >
              Marcar todos como Presentes
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{st.fullName}</h4>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {st.danceRole === 'LEADER' ? 'Leader' : st.danceRole === 'FOLLOWER' ? 'Follower' : 'Ambos'}
                  </span>
                </div>

                {/* Botones de Estatus */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'PRESENT')}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      st.attendanceStatus === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Presente
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'LATE')}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      st.attendanceStatus === 'LATE'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" /> Retardo
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'ABSENT')}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      st.attendanceStatus === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Falta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700">Sin alumnos en esta clase</h3>
          <p className="text-xs text-slate-400 mt-1">
            Asigna alumnos a este taller desde el módulo de Alumnos para tomar lista.
          </p>
        </div>
      )}
    </main>
  );
}