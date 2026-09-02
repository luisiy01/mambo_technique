// app/dashboard/attendance/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { AttendanceContent } from '@/components/attendance/AttendanceContent';

export default function AttendancePage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/attendance" />
      <AttendanceContent />
    </div>
  );
}