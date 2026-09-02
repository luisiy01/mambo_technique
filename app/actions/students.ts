// app/actions/students.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { DanceRole, StudentStatus, PaymentStatus } from '@prisma/client';

export interface StudentFormData {
  fullName: string;
  phone: string;
  email?: string;
  danceRole: DanceRole;
  level: string;
  scheduleId?: string;
  paymentStatus: PaymentStatus;
  paymentDueDate: number;
  status: StudentStatus;
}

// 1. Obtener todos los alumnos
export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        schedule: {
          select: {
            id: true,
            className: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students.map((st) => ({
      id: st.id,
      fullName: st.fullName,
      phone: st.phone,
      email: st.email || undefined,
      danceRole: st.danceRole,
      level: st.level,
      scheduleId: st.scheduleId || undefined,
      assignedClass: st.schedule 
        ? `${st.schedule.className} (${st.schedule.location?.name || 'Sede N/A'})` 
        : 'Sin clase asignada',
      paymentStatus: st.paymentStatus,
      paymentDueDate: st.paymentDueDate,
      status: st.status,
    }));
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    throw new Error('No se pudieron cargar los alumnos.');
  }
}

// 2. Crear alumno
export async function createStudent(data: StudentFormData) {
  try {
    const newStudent = await prisma.student.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        danceRole: data.danceRole,
        level: data.level,
        scheduleId: data.scheduleId || null,
        paymentStatus: data.paymentStatus,
        paymentDueDate: data.paymentDueDate,
        status: data.status,
      },
    });

    revalidatePath('/dashboard/students');
    return { success: true, data: newStudent };
  } catch (error) {
    console.error('Error al crear alumno:', error);
    return { success: false, error: 'Error al registrar al alumno' };
  }
}

// 3. Actualizar alumno
export async function updateStudent(id: string, data: StudentFormData) {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        danceRole: data.danceRole,
        level: data.level,
        scheduleId: data.scheduleId || null,
        paymentStatus: data.paymentStatus,
        paymentDueDate: data.paymentDueDate,
        status: data.status,
      },
    });

    revalidatePath('/dashboard/students');
    return { success: true, data: updatedStudent };
  } catch (error) {
    console.error('Error al actualizar alumno:', error);
    return { success: false, error: 'Error al actualizar al alumno' };
  }
}

// 4. Eliminar alumno
export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath('/dashboard/students');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    return { success: false, error: 'Error al eliminar al alumno' };
  }
}