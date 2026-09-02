// components/payments/PaymentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, UserCheck } from 'lucide-react';
import { PaymentFormData } from '../../actions/payments';

export interface StudentOption {
  id: string;
  fullName: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PaymentFormData) => void;
  students: StudentOption[];
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  students 
}: PaymentModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [concept, setConcept] = useState('Colegiatura Mensual');
  const [amount, setAmount] = useState<number | ''>(800);
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentFormData['paymentMethod']>('TRANSFER');
  const [status, setStatus] = useState<PaymentFormData['status']>('COMPLETED');

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
      setSelectedStudent(null);
      setStudentSearch('');
      setConcept('Colegiatura Mensual');
      setAmount(800);
      setPaymentMethod('TRANSFER');
      setStatus('COMPLETED');
    }
  }, [isOpen]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [students, studentSearch]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount || !date) return;

    onSave({
      studentId: selectedStudent.id,
      concept,
      amount: Number(amount),
      date: new Date(date),
      paymentMethod,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar Nuevo Pago</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Selector con Búsqueda de Alumno */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seleccionar Alumno <span className="text-red-500">*</span>
            </label>

            {selectedStudent ? (
              <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-900">
                    {selectedStudent.fullName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentSearch('');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Buscar alumno por nombre..."
                  value={studentSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />

                {/* Desplegable */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-10 divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudent(st);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                        >
                          {st.fullName}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">
                        No se encontró ningún alumno con ese nombre.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Concepto</label>
            <input
              required
              type="text"
              placeholder="ej. Colegiatura Septiembre - Mambo"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monto (MXN)</label>
              <input
                required
                type="number"
                min={0}
                placeholder="800"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Pago</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentFormData['paymentMethod'])}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="TRANSFER">Transferencia / SPEI</option>
                <option value="CASH">Efectivo</option>
                <option value="CARD">Tarjeta</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estatus</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentFormData['status'])}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="COMPLETED">Completado</option>
                <option value="PENDING">Pendiente</option>
              </select>
            </div>
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
              disabled={!selectedStudent}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStudent 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}