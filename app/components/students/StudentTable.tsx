// components/students/StudentTable.tsx
import React from 'react';
import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { StudentItem } from './StudentsContent';

interface StudentTableProps {
  students: StudentItem[];
  onEdit: (student: StudentItem) => void;
  onDelete: (student: StudentItem) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const getPaymentBadge = (status: StudentItem['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">🟢 Al día</span>;
      case 'PENDING':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-semibold">🔴 Pendiente</span>;
      case 'DUE_SOON':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold">🟡 Próximo</span>;
    }
  };

  const getRoleBadge = (role: StudentItem['danceRole']) => {
    switch (role) {
      case 'LEADER':
        return <span className="bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded border border-blue-200 font-medium">Leader</span>;
      case 'FOLLOWER':
        return <span className="bg-purple-50 text-purple-700 text-[11px] px-2 py-0.5 rounded border border-purple-200 font-medium">Follower</span>;
      case 'BOTH':
        return <span className="bg-teal-50 text-teal-700 text-[11px] px-2 py-0.5 rounded border border-teal-200 font-medium">Ambos</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <th className="py-3.5 px-4">Alumno</th>
              <th className="py-3.5 px-4">Contacto / WhatsApp</th>
              <th className="py-3.5 px-4">Perfil Baile</th>
              <th className="py-3.5 px-4">Clase / Sede</th>
              <th className="py-3.5 px-4">Estado Pago</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{student.fullName}</div>
                    <span className="text-xs text-slate-400">Día de pago: {student.paymentDueDate} de c/mes</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">{student.phone}</span>
                      {student.phone && (
                        <a
                          href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 p-1 bg-emerald-50 rounded"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      {getRoleBadge(student.danceRole)}
                      <span className="text-[11px] text-slate-500">{student.level}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-slate-800">{student.assignedClass}</span>
                  </td>
                  <td className="py-3.5 px-4">{getPaymentBadge(student.paymentStatus)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar alumno"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar alumno"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No se encontraron alumnos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}