// app/actions/locations.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { RentType } from '@prisma/client';

export interface LocationFormData {
  name: string;
  address: string;
  contactPhone?: string;
  rentType: RentType;
  rentCost: string;
  capacity: number;
  amenities: string[];
}

// 1. Obtener todas las sedes con sus clases asignadas
export async function getLocations() {
  try {
    console.log('here1 ?')
    const locations = await prisma.location.findMany({
      include: {
        schedules: {
          select: {
            id: true,
            className: true,
            days: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formatear los datos para la interfaz
    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      googleMapsUrl: loc.googleMapsUrl || undefined,
      contactPhone: loc.contactPhone || undefined,
      rentType: loc.rentType,
      rentCost: loc.rentCost,
      capacity: loc.capacity,
      amenities: loc.amenities,
      schedules: loc.schedules.map((s) => ({
        id: s.id,
        name: s.className,
        time: `${s.days.join(' y ')} - ${s.startTime} a ${s.endTime}`,
      })),
    }));
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    throw new Error('No se pudieron cargar las sedes.');
  }
}

// 2. Crear nueva sede
export async function createLocation(data: LocationFormData) {
  try {
    const newLocation = await prisma.location.create({
      data: {
        name: data.name,
        address: data.address,
        contactPhone: data.contactPhone || null,
        rentType: data.rentType,
        rentCost: data.rentCost,
        capacity: data.capacity,
        amenities: data.amenities,
      },
    });

    revalidatePath('/dashboard/locations');
    return { success: true, data: newLocation };
  } catch (error) {
    console.error('Error al crear sede:', error);
    return { success: false, error: 'Error al registrar la sede' };
  }
}

// 3. Actualizar sede existente
export async function updateLocation(id: string, data: LocationFormData) {
  try {
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        contactPhone: data.contactPhone || null,
        rentType: data.rentType,
        rentCost: data.rentCost,
        capacity: data.capacity,
        amenities: data.amenities,
      },
    });

    revalidatePath('/dashboard/locations');
    return { success: true, data: updatedLocation };
  } catch (error) {
    console.error('Error al actualizar sede:', error);
    return { success: false, error: 'Error al actualizar la sede' };
  }
}

// 4. Eliminar sede
export async function deleteLocation(id: string) {
  try {
    await prisma.location.delete({
      where: { id },
    });

    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar sede:', error);
    return { success: false, error: 'Error al eliminar la sede' };
  }
}