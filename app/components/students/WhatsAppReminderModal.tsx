// components/students/WhatsAppReminderModal.tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, ExternalLink, X, DollarSign, Loader2 } from 'lucide-react';
import { generateWhatsAppReminderUrl, StudentWhatsAppInfo } from '@/lib/whatsapp';
import { getAcademyConfig } from '../../actions/config';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    fullName: string;
    phone: string;
    assignedClass?: string;
    paymentDueDate?: number;
  } | null;
}

export function WhatsAppReminderModal({ isOpen, onClose, student }: WhatsAppReminderModalProps) {
  const [customAmount, setCustomAmount] = useState<number>(800);
  const [config, setConfig] = useState<Awaited<ReturnType<typeof getAcademyConfig>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getAcademyConfig()
        .then((cfg) => {
          setConfig(cfg);
          setCustomAmount(cfg.defaultMonthlyFee || 800);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const studentInfo: StudentWhatsAppInfo = {
    fullName: student.fullName,
    phone: student.phone,
    assignedClass: student.assignedClass,
    paymentDueDate: student.paymentDueDate,
    amountToPay: customAmount,
    academyName: config?.academyName,
    bankName: config?.bankName || undefined,
    bankAccount: config?.bankAccount || undefined,
    clabe: config?.clabe || undefined,
  };

  const whatsappUrl = generateWhatsAppReminderUrl(studentInfo);

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recordatorio de Pago</h3>
            <p className="text-xs text-slate-500">{student.fullName}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mb-2" />
            <p className="text-xs">Cargando datos institucionales...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monto a Recordar (MXN)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vista Previa del Mensaje
              </label>
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3 text-xs text-slate-700 whitespace-pre-line font-sans leading-relaxed max-h-48 overflow-y-auto">
                {`Hola ${student.fullName.split(' ')[0]} 👋✨ ¡Esperamos que estés teniendo un excelente día! \n\nTe escribimos de *${config?.academyName || 'la academia'}* para recordarte cordialmente sobre el pago de *$${customAmount} MXN* correspondiente a *${student.assignedClass || 'tu taller'}*, cuyo vencimiento es *el día ${student.paymentDueDate || 5} de este mes*.${
                  config?.clabe
                    ? `\n\n💳 *Datos para transferencia/SPEI:*\n• Banco: ${config.bankName || 'BBVA'}\n• CLABE: ${config.clabe}`
                    : ''
                }\n\nSi ya realizaste tu pago o transferencia, por favor reenvíanos tu comprobante por este medio. ¡Muchas gracias y nos vemos en clase! 💃🕺`}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> Enviar por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}