// app/dashboard/students/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { StudentsContent } from '@/components/students/StudentsContent';

export default function StudentsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/students" />
      <StudentsContent />
    </div>
  );
}