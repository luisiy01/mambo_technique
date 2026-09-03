// components/payments/DownloadReceiptButton.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Loader2 } from 'lucide-react';
import { PaymentReceiptPDF } from './PaymentReceiptPDF';
import { PaymentItem } from './PaymentsContent';

interface DownloadReceiptButtonProps {
  payment: PaymentItem;
}

export function DownloadReceiptButton({ payment }: DownloadReceiptButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button
        disabled
        className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PaymentReceiptPDF payment={payment} />}
      fileName={`Recibo_${payment.studentName.replace(/\s+/g, '_')}_${payment.date}.pdf`}
    >
      {/* @ts-ignore */}
      {({ loading }) => (
        <button
          type="button"
          title="Descargar Recibo en PDF"
          disabled={loading}
          className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}