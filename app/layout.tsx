// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Academia de Baile - Management System',
  description: 'Sistema integral de gestión de sedes, clases, alumnos, asistencia y finanzas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {/* Componente global para las notificaciones flotantes */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}