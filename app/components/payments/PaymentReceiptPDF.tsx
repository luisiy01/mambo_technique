// components/payments/PaymentReceiptPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PaymentReceiptProps {
  payment: {
    id: string;
    studentName: string;
    concept: string;
    amount: number;
    date: string;
    paymentMethod: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  receiptBadge: {
    textAlign: 'right',
  },
  receiptNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  section: {
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
  },
  colConcept: {
    flex: 3,
  },
  colAmount: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalBox: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 4,
    textAlign: 'right',
    width: 200,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3730a3',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

export function PaymentReceiptPDF({ payment }: PaymentReceiptProps) {
  const formattedMethod =
    payment.paymentMethod === 'TRANSFER'
      ? 'Transferencia / SPEI'
      : payment.paymentMethod === 'CASH'
      ? 'Efectivo'
      : 'Tarjeta';

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Academia de Baile</Text>
            <Text style={styles.subtitle}>Comprobante Oficial de Pago</Text>
          </View>
          <View style={styles.receiptBadge}>
            <Text style={styles.receiptNumber}>RECIBO #{payment.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.subtitle}>Fecha: {payment.date}</Text>
          </View>
        </View>

        {/* Datos del Alumno y Método */}
        <View style={styles.grid}>
          <View>
            <Text style={styles.label}>Recibido de:</Text>
            <Text style={styles.value}>{payment.studentName}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.label}>Método de Pago:</Text>
            <Text style={styles.value}>{formattedMethod}</Text>
          </View>
        </View>

        {/* Tabla Desglose */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colConcept, { fontWeight: 'bold' }]}>Concepto / Descripción</Text>
            <Text style={[styles.colAmount, { fontWeight: 'bold' }]}>Monto</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colConcept}>{payment.concept}</Text>
            <Text style={styles.colAmount}>${payment.amount.toLocaleString('es-MX')} MXN</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.label}>Total Pagado:</Text>
            <Text style={styles.totalText}>${payment.amount.toLocaleString('es-MX')} MXN</Text>
          </View>
        </View>

        {/* Pie de Página */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¡Muchas gracias por tu pago! Este documento sirve como comprobante oficial de tu colegiatura.
          </Text>
        </View>
      </Page>
    </Document>
  );
}