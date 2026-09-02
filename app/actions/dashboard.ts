// app/actions/dashboard.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardData() {
  try {
    // Definir inicio y fin del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Consultas en paralelo para optimizar el rendimiento
    const [
      activeStudentsCount,
      schedulesCount,
      locationsCount,
      pendingPaymentsCount,
      monthlyPayments,
      recentPayments,
    ] = await Promise.all([
      // Total alumnos activos
      prisma.student.count({
        where: { status: 'ACTIVE' },
      }),
      // Total clases/horarios
      prisma.schedule.count(),
      // Total sedes
      prisma.location.count(),
      // Alumnos con pago pendiente o próximo a vencer
      prisma.student.count({
        where: {
          paymentStatus: { in: ['PENDING', 'DUE_SOON'] },
        },
      }),
      // Pagos completados en el mes actual
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
      // Últimos 5 pagos registrados
      prisma.payment.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          student: {
            select: {
              fullName: true,
            },
          },
        },
      }),
    ]);

    // Calcular suma total de ingresos del mes
    const monthlyIncome = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      metrics: {
        activeStudents: activeStudentsCount,
        totalSchedules: schedulesCount,
        totalLocations: locationsCount,
        pendingPayments: pendingPaymentsCount,
        monthlyIncome,
      },
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        studentName: p.student?.fullName || 'Alumno Desconocido',
        concept: p.concept,
        amount: p.amount,
        date: new Date(p.date).toISOString().split('T')[0],
        paymentMethod: p.paymentMethod,
        status: p.status,
      })),
    };
  } catch (error) {
    console.error('Error al obtener datos del Dashboard:', error);
    throw new Error('No se pudieron cargar los datos del Dashboard.');
  }
}