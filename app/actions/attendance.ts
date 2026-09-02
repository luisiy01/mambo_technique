// app/actions/attendance.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AttendanceStatus } from '@prisma/client';

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
}

// 1. Obtener la lista de alumnos inscritos en una clase y su estatus de asistencia para una fecha
export async function getClassAttendance(scheduleId: string, dateString: string) {
  try {
    const targetDate = new Date(`${dateString}T00:00:00.000Z`);

    // Consultar el horario con sus alumnos inscritos
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        location: { select: { name: true } },
        students: {
          where: { status: 'ACTIVE' },
          orderBy: { fullName: 'asc' },
        },
      },
    });

    if (!schedule) {
      throw new Error('Clase no encontrada');
    }

    // Consultar los registros de asistencia existentes para esa clase y fecha
    const existingAttendances = await prisma.attendance.findMany({
      where: {
        scheduleId,
        date: targetDate,
      },
    });

    // Mapear los alumnos con su estatus actual (si no existe registro, por defecto PRESENT)
    const studentsWithAttendance = schedule.students.map((student) => {
      const record = existingAttendances.find((a) => a.studentId === student.id);
      return {
        id: student.id,
        fullName: student.fullName,
        danceRole: student.danceRole,
        attendanceStatus: record ? record.status : ('PRESENT' as AttendanceStatus),
        attendanceId: record ? record.id : null,
      };
    });

    return {
      scheduleName: schedule.className,
      locationName: schedule.location?.name || 'Sede N/A',
      instructor: schedule.instructor,
      students: studentsWithAttendance,
    };
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    throw new Error('No se pudo cargar la lista de asistencia.');
  }
}

// 2. Guardar o actualizar masivamente la asistencia de la clase
export async function saveClassAttendance(
  scheduleId: string,
  dateString: string,
  records: AttendanceRecordInput[]
) {
  try {
    const targetDate = new Date(`${dateString}T00:00:00.000Z`);

    // Usamos una transacción para actualizar o insertar el pase de lista de todos los alumnos
    await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_scheduleId_date: {
              studentId: record.studentId,
              scheduleId,
              date: targetDate,
            },
          },
          update: {
            status: record.status,
          },
          create: {
            studentId: record.studentId,
            scheduleId,
            date: targetDate,
            status: record.status,
          },
        })
      )
    );

    revalidatePath('/dashboard/attendance');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar asistencia:', error);
    return { success: false, error: 'Error al guardar el pase de lista' };
  }
}