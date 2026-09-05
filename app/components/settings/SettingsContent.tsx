// components/settings/SettingsContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  Save, 
  Loader2 
} from 'lucide-react';
import { getAcademyConfig, updateAcademyConfig, AcademyConfigData } from '../../actions/config';
import { toast } from 'sonner';

export function SettingsContent() {
  const [formData, setFormData] = useState<AcademyConfigData>({
    academyName: '',
    phone: '',
    email: '',
    address: '',
    bankName: '',
    bankAccount: '',
    clabe: '',
    defaultMonthlyFee: 800,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadConfig() {
      try {
        const config = await getAcademyConfig();
        setFormData({
          academyName: config.academyName || '',
          phone: config.phone || '',
          email: config.email || '',
          address: config.address || '',
          bankName: config.bankName || '',
          bankAccount: config.bankAccount || '',
          clabe: config.clabe || '',
          defaultMonthlyFee: config.defaultMonthlyFee || 800,
        });
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateAcademyConfig(formData);
    setIsSaving(false);

    if (res.success) {
      toast.success('Configuración guardada correctamente', {
        description: 'Los datos institucionales han sido actualizados.',
      });
    } else {
      toast.error('Error al guardar cambios', {
        description: res.error,
      });
    }
  };

  if (!mounted || isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Cargando datos institucionales...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-7 w-7 text-indigo-600" />
            Configuración General de la Academia
          </h2>
          <p className="text-slate-500 text-sm">
            Administra la información oficial, contacto y datos bancarios impresos en recibos y recordatorios.
          </p>
        </div>

        <button
          type="submit"
          form="settings-form"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors text-sm disabled:bg-slate-300 self-start md:self-auto"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Sección: Información Comercial / Identidad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-600" />
              Identidad de la Academia
            </h3>
            <p className="text-xs text-slate-500">
              Esta información encabezará los recibos PDF y el panel principal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Oficial de la Academia
              </label>
              <input
                type="text"
                required
                value={formData.academyName}
                onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej. Sabor & Mambo Dance Academy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cuota / Colegiatura Mensual sugerida (MXN)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  required
                  value={formData.defaultMonthlyFee}
                  onChange={(e) => setFormData({ ...formData, defaultMonthlyFee: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Datos de Contacto */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-600" />
              Contacto y Ubicación Principal
            </h3>
            <p className="text-xs text-slate-500">
              Número telefónico para envíos de WhatsApp y dirección impresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono Institucional (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="3120000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico de Contacto
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="contacto@academia.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dirección Física
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Av. Hidalgo #123"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Datos Bancarios (Transferencias / SPEI) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Cuentas Bancarias para Cobro (SPEI)
            </h3>
            <p className="text-xs text-slate-500">
              Datos utilizados para compartir fichas de pago a los alumnos por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institución Bancaria
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej. BBVA / Banorte"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de Cuenta / Tarjeta
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CLABE Interbancaria
              </label>
              <input
                type="text"
                value={formData.clabe}
                onChange={(e) => setFormData({ ...formData, clabe: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="012180001234567890"
              />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}