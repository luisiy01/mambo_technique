// components/Sidebar.tsx
import React from "react";
import {
  MapPin,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  currentRoute?: string;
}

export function Sidebar({ currentRoute = "/dashboard" }: SidebarProps) {
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: TrendingUp },
    { label: "Lugares de Clases", href: "/dashboard/locations", icon: MapPin },
    { label: "Alumnos", href: "/dashboard/students", icon: Users },
    { label: "Horarios", href: "/dashboard/schedules", icon: Calendar },
    { label: "Pagos", href: "/dashboard/payments", icon: CreditCard },
    { name: "Asistencia", href: "/dashboard/attendance", icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-wide">
            Mambo Dance & Technique
          </h1>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="px-2 py-4 border-t border-slate-800 text-xs text-slate-400">
        Panel de Control de Baile v1.1
      </div>
    </aside>
  );
}
