// app/actions/config.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface AcademyConfigData {
  academyName: string;
  phone: string;
  email: string;
  address: string;
  bankName: string;
  bankAccount: string;
  clabe: string;
  defaultMonthlyFee: number;
}

// Obtener o inicializar la configuración general
export async function getAcademyConfig() {
  try {
    let config = await prisma.academyConfig.findUnique({
      where: { id: 'default-config' },
    });

    if (!config) {
      config = await prisma.academyConfig.create({
        data: {
          id: 'default-config',
        },
      });
    }

    return config;
  } catch (error) {
    console.error('Error al obtener la configuración:', error);
    throw new Error('No se pudo cargar la configuración de la academia.');
  }
}

// Actualizar la configuración general
export async function updateAcademyConfig(data: AcademyConfigData) {
  try {
    const updated = await prisma.academyConfig.upsert({
      where: { id: 'default-config' },
      update: {
        academyName: data.academyName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        clabe: data.clabe,
        defaultMonthlyFee: Number(data.defaultMonthlyFee),
      },
      create: {
        id: 'default-config',
        academyName: data.academyName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        clabe: data.clabe,
        defaultMonthlyFee: Number(data.defaultMonthlyFee),
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/payments');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    return { success: false, error: 'Error al guardar los cambios' };
  }
}