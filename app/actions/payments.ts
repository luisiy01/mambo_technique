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

// 1. Obtener todos los pagos registrados con la información de su alumno
export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
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
    });

    return payments.map((p) => ({
      id: p.id,
      studentId: p.studentId,
      studentName: p.student?.fullName || 'Alumno no encontrado',
      concept: p.concept,
      amount: p.amount,
      date: new Date(p.date).toISOString().split('T')[0],
      paymentMethod: p.paymentMethod,
      status: p.status,
    }));
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw new Error('No se pudieron cargar los pagos.');
  }
}

// 2. Registrar un nuevo pago
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

    // Si el pago es completado, podemos actualizar opcionalmente el estado del alumno a PAID
    if (data.status === 'COMPLETED') {
      await prisma.student.update({
        where: { id: data.studentId },
        data: { paymentStatus: 'PAID' },
      });
    }

    revalidatePath('/dashboard/payments');
    revalidatePath('/dashboard/students');
    return { success: true, data: newPayment };
  } catch (error) {
    console.error('Error al registrar pago:', error);
    return { success: false, error: 'Error al registrar el pago' };
  }
}