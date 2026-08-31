// app/dashboard/payments/page.tsx
import { Sidebar } from '@/components/Sidebar';
import { PaymentsContent } from '@/components/payments/PaymentsContent';

export default function PaymentsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentRoute="/dashboard/payments" />
      <PaymentsContent />
    </div>
  );
}