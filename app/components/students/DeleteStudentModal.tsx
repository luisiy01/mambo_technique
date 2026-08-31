// components/students/DeleteStudentModal.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteStudentModalProps {
  studentName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteStudentModal({ studentName, onClose, onConfirm }: DeleteStudentModalProps) {
  if (!studentName) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">
          ¿Eliminar a "{studentName}"?
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Esta acción removerá el registro del alumno de tu lista. ¿Estás seguro de continuar?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="w-full py-2 border text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}