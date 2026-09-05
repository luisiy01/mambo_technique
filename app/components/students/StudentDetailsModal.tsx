// components/students/StudentDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  MessageCircle, 
  Loader2,
  Award,
  Building2
} from 'lucide-react';
import { getStudentDetails } from '../../actions/students';
import { generateWhatsAppReminderUrl } from '@/lib/whatsapp';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

export function StudentDetailsModal({ isOpen, onClose, studentId }: StudentDetailsModalProps) {
  const [details, setDetails] = useState<Awaited<ReturnType<typeof getStudentDetails>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'payments'>('attendance');

  useEffect(() => {
    if (isOpen && studentId) {
      setIsLoading(true);
      getStudentDetails(studentId)
        .then((data) => setDetails(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      setDetails(null);
    }
  }, [isOpen, studentId]);

  if (!isOpen || !studentId) return null;

  const handleOpenWhatsApp = () => {
    if (!details) return;
    const url = generateWhatsAppReminderUrl({
      fullName: details.fullName,
      phone: details.phone,
      assignedClass: details.assignedClass,
      paymentDueDate: details.paymentDueDate,
      amountToPay: 800,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading || !details ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm">Cargando expediente del alumno...</p>
          </div>
        ) : (
          <div>
            {/* Encabezado del Perfil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{details.fullName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{details.phone}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600">{details.level}</span>
                    <span>•</span>
                    <span className="uppercase font-bold text-slate-700">
                      {details.danceRole === 'LEADER' ? 'Leader' : details.danceRole === 'FOLLOWER' ? 'Follower' : 'Ambos'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>

            {/* Tarjetas de Indicadores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              {/* Porcentaje Asistencia */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Asistencia</span>
                <p className="text-lg font-extrabold text-indigo-600 mt-0.5">
                  {details.metrics.attendancePercentage}%
                </p>
              </div>

              {/* Clases Tomadas */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Asistencias</span>
                <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                  {details.metrics.presents} / {details.metrics.totalAttendances}
                </p>
              </div>

              {/* Total Invertido */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Pagado Histórico</span>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                  ${details.metrics.totalPaidAmount.toLocaleString('es-MX')}
                </p>
              </div>

              {/* Estatus Financiero */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Estatus Pago</span>
                <p
                  className={`text-xs font-extrabold uppercase mt-1.5 ${
                    details.paymentStatus === 'PAID'
                      ? 'text-emerald-600'
                      : details.paymentStatus === 'DUE_SOON'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {details.paymentStatus === 'PAID'
                    ? 'Al día'
                    : details.paymentStatus === 'DUE_SOON'
                    ? 'Por vencer'
                    : 'Pendiente'}
                </p>
              </div>
            </div>

            {/* Taller Asignado */}
            <div className="mb-6 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-950 font-semibold">
                <Building2 className="h-4 w-4 text-indigo-600" />
                <span>{details.assignedClass}</span>
              </div>
              <span className="text-slate-500">Prof. {details.instructor}</span>
            </div>

            {/* Selector de Pestañas */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`pb-2.5 px-4 text-xs font-bold transition-colors flex items-center gap-2 border-b-2 ${
                  activeTab === 'attendance'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Calendar className="h-4 w-4" /> Historial Asistencia ({details.attendances.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`pb-2.5 px-4 text-xs font-bold transition-colors flex items-center gap-2 border-b-2 ${
                  activeTab === 'payments'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <CreditCard className="h-4 w-4" /> Historial Pagos ({details.payments.length})
              </button>
            </div>

            {/* Pestaña: Asistencia */}
            {activeTab === 'attendance' && (
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                {details.attendances.length > 0 ? (
                  details.attendances.map((a) => (
                    <div key={a.id} className="py-2 px-1 flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{a.date}</span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          a.status === 'PRESENT'
                            ? 'text-emerald-600'
                            : a.status === 'LATE'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {a.status === 'PRESENT' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Presente
                          </>
                        ) : a.status === 'LATE' ? (
                          <>
                            <Clock className="h-3.5 w-3.5" /> Retardo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" /> Falta
                          </>
                        )}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400 italic">
                    No hay registros de asistencia para este alumno.
                  </p>
                )}
              </div>
            )}

            {/* Pestaña: Pagos */}
            {activeTab === 'payments' && (
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                {details.payments.length > 0 ? (
                  details.payments.map((p) => (
                    <div key={p.id} className="py-2.5 px-1 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{p.concept}</p>
                        <p className="text-[10px] text-slate-400">{p.date} • {p.paymentMethod}</p>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        ${p.amount.toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400 italic">
                    No hay pagos registrados para este alumno.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}