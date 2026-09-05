// app/dashboard/settings/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { SettingsContent } from '@/components/settings/SettingsContent';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/settings" />
      <SettingsContent />
    </div>
  );
}