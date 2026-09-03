// components/students/StudentTable.tsx
import React, { useState } from 'react';
import { Edit2, Trash2, MessageCircle } from 'lucide-react';
import { StudentItem } from './StudentsContent';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';

interface StudentTableProps {
  students: StudentItem[];
  onEdit: (student: StudentItem) => void;
  onDelete: (student: StudentItem) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const [selectedStudentForWhatsApp, setSelectedStudentForWhatsApp] = useState<StudentItem | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Rol / Nivel</th>
                <th className="py-3 px-4">Taller Asignado</th>
                <th className="py-3 px-4">Estatus Pago</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.length > 0 ? (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                    <td className="py-3 px-4">
                      <div>{st.phone}</div>
                      {st.email && <div className="text-[10px] text-slate-400">{st.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {st.danceRole === 'LEADER' ? 'Leader' : st.danceRole === 'FOLLOWER' ? 'Follower' : 'Ambos'}
                      </span>
                      <div className="text-[10px] text-slate-400">{st.level}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-indigo-900">{st.assignedClass}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          st.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.paymentStatus === 'DUE_SOON'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.paymentStatus === 'PAID'
                          ? 'Al día'
                          : st.paymentStatus === 'DUE_SOON'
                          ? 'Por vencer'
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Botón rápido de WhatsApp */}
                        <button
                          type="button"
                          title="Enviar Recordatorio por WhatsApp"
                          onClick={() => setSelectedStudentForWhatsApp(st)}
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Editar Alumno"
                          onClick={() => onEdit(st)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Eliminar Alumno"
                          onClick={() => onDelete(st)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hay alumnos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de WhatsApp */}
      <WhatsAppReminderModal
        isOpen={Boolean(selectedStudentForWhatsApp)}
        onClose={() => setSelectedStudentForWhatsApp(null)}
        student={selectedStudentForWhatsApp}
      />
    </>
  );
}