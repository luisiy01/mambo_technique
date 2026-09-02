// app/actions/payments.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PaymentMethod, TransactionStatus } from '@prisma/client';

export interface PaymentFormData {
  studentId: string;
  concept: string;
  amount: number;
  date: Date;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

// Obtener pagos e ingresos filtrados dinámicamente por mes y año
export async function getPayments(selectedMonth?: number, selectedYear?: number) {
  try {
    const now = new Date();
    const month = selectedMonth !== undefined ? selectedMonth : now.getUTCMonth() + 1; // 1-12
    const year = selectedYear !== undefined ? selectedYear : now.getUTCFullYear();

    // Rango UTC para el mes y año seleccionados
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const [payments, monthlyCompletedPayments] = await Promise.all([
      // 1. Historial de pagos
      prisma.payment.findMany({
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      // 2. Pagos COMPLETADOS filtrados por el mes/año seleccionado
      prisma.payment.findMany({
        where: {
          status: 'COMPLETED',
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          amount: true,
        },
      }),
    ]);

    // Sumar ingresos del mes/año seleccionado
    const monthlyIncome = monthlyCompletedPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      payments: payments.map((p) => ({
        id: p.id,
        studentId: p.studentId,
        studentName: p.student?.fullName || 'Alumno no encontrado',
        concept: p.concept,
        amount: p.amount,
        date: new Date(p.date).toISOString().split('T')[0],
        paymentMethod: p.paymentMethod,
        status: p.status,
      })),
      monthlyIncome,
      selectedMonth: month,
      selectedYear: year,
    };
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw new Error('No se pudieron cargar los pagos.');
  }
}

// Registrar un nuevo pago
export async function createPayment(data: PaymentFormData) {
  try {
    const newPayment = await prisma.payment.create({
      data: {
        studentId: data.studentId,
        concept: data.concept,
        amount: data.amount,
        date: data.date,
        paymentMethod: data.paymentMethod,
        status: data.status,
      },
    });

    if (data.status === 'COMPLETED') {
      await prisma.student.update({
        where: { id: data.studentId },
        data: { paymentStatus: 'PAID' },
      });
    }

    revalidatePath('/dashboard/payments');
    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard');
    return { success: true, data: newPayment };
  } catch (error) {
    console.error('Error al registrar pago:', error);
    return { success: false, error: 'Error al registrar el pago' };
  }
}