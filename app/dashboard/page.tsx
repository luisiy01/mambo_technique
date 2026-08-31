// app/dashboard/page.tsx
import React from 'react';
import { 
  MapPin, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ArrowRight 
} from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo mientras conectamos la DB
  const metrics = [
    {
      title: 'Lugares de Clases',
      value: '3',
      description: 'Sedes activas registradas',
      icon: MapPin,
      color: 'bg-blue-500',
      href: '/dashboard/locations',
    },
    {
      title: 'Alumnos Totales',
      value: '48',
      description: '38 activos este mes',
      icon: Users,
      color: 'bg-emerald-500',
      href: '/dashboard/students',
    },
    {
      title: 'Pagos del Mes',
      value: '$14,500',
      description: '8 pagos pendientes',
      icon: CreditCard,
      color: 'bg-violet-500',
      href: '/dashboard/payments',
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-wide">Mambo Dance & Technique</h1>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 font-medium text-white transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              Dashboard
            </a>
            <a
              href="#lugares"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <MapPin className="h-5 w-5" />
              Lugares de Clases
            </a>
            <a
              href="#alumnos"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Users className="h-5 w-5" />
              Alumnos
            </a>
            <a
              href="#pagos"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              Pagos
            </a>
          </nav>
        </div>

        <div className="px-2 py-4 border-t border-slate-800 text-xs text-slate-400">
          Panel de Control de Baile v1.0
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Encabezado */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Panel General</h2>
          <p className="text-slate-500 text-sm">
            Bienvenido. Aquí tienes el resumen de tus clases, alumnos y finanzas.
          </p>
        </header>

        {/* Tarjetas de Accesos Rápidos / Métricas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">
                      {item.title}
                    </span>
                    <div className={`p-2.5 rounded-xl ${item.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">
                    {item.value}
                  </div>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>

                <a
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Gestionar {item.title.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </section>

        {/* Sección de Resumen Rápido (Se construirá a detalle en los siguientes pasos) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Próximos Alumnos por Cobrar
            </h3>
            <p className="text-xs text-slate-400">
              Aquí aparecerá la lista rápida de colegiaturas pendientes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Sedes y Horarios de Hoy
            </h3>
            <p className="text-xs text-slate-400">
              Aquí aparecerán las clases programadas para la jornada.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}