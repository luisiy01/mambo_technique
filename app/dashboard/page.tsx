// app/dashboard/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { DashboardContent } from '../components/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard" />
      <DashboardContent />
    </div>
  );
}