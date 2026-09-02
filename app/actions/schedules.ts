// app/actions/schedules.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ScheduleFormData {
  className: string;
  locationId: string;
  days: string[];
  startTime: string;
  endTime: string;
  level: string;
  maxCapacity: number;
  instructor: string;
}

// 1. Obtener todos los horarios junto con su sede asignada
export async function getSchedules() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        students: {
          select: {
            id: true,
            danceRole: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return schedules.map((sc) => {
      const leaders = sc.students.filter((st) => st.danceRole === 'LEADER').length;
      const followers = sc.students.filter((st) => st.danceRole === 'FOLLOWER').length;

      return {
        id: sc.id,
        className: sc.className,
        locationId: sc.locationId,
        locationName: sc.location?.name || 'Sede no encontrada',
        days: sc.days,
        startTime: sc.startTime,
        endTime: sc.endTime,
        level: sc.level,
        maxCapacity: sc.maxCapacity,
        enrolledLeaders: leaders,
        enrolledFollowers: followers,
        instructor: sc.instructor,
      };
    });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    throw new Error('No se pudieron cargar los horarios.');
  }
}

// 2. Crear un nuevo horario
export async function createSchedule(data: ScheduleFormData) {
  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        className: data.className,
        locationId: data.locationId,
        days: data.days,
        startTime: data.startTime,
        endTime: data.endTime,
        level: data.level,
        maxCapacity: data.maxCapacity,
        instructor: data.instructor,
      },
    });

    revalidatePath('/dashboard/schedules');
    return { success: true, data: newSchedule };
  } catch (error) {
    console.error('Error al crear horario:', error);
    return { success: false, error: 'Error al registrar el horario' };
  }
}

// 3. Actualizar un horario existente
export async function updateSchedule(id: string, data: ScheduleFormData) {
  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        className: data.className,
        locationId: data.locationId,
        days: data.days,
        startTime: data.startTime,
        endTime: data.endTime,
        level: data.level,
        maxCapacity: data.maxCapacity,
        instructor: data.instructor,
      },
    });

    revalidatePath('/dashboard/schedules');
    return { success: true, data: updatedSchedule };
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    return { success: false, error: 'Error al actualizar el horario' };
  }
}

// 4. Eliminar un horario
export async function deleteSchedule(id: string) {
  try {
    await prisma.schedule.delete({
      where: { id },
    });

    revalidatePath('/dashboard/schedules');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    return { success: false, error: 'Error al eliminar el horario' };
  }
}