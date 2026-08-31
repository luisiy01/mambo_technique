// app/dashboard/schedules/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { SchedulesContent } from '@/components/schedules/SchedulesContent';

export default function SchedulesPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/schedules" />
      <SchedulesContent />
    </div>
  );
}