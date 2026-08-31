// app/dashboard/locations/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { LocationsContent } from '@/components/LocationsContent';

export default function LocationsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/locations" />
      <LocationsContent />
    </div>
  );
}