// lib/whatsapp.ts

export interface StudentWhatsAppInfo {
  fullName: string;
  phone: string;
  assignedClass?: string;
  paymentDueDate?: number;
  amountToPay?: number;
}

// Limpia el número de teléfono para que sea compatible con la API de WhatsApp (wa.me)
export function formatPhoneNumber(phone: string, defaultCountryCode = '52'): string {
  // Elimina todo lo que no sea un número
  let cleaned = phone.replace(/\D/g, '');

  // Si el número no incluye código de país (10 dígitos típicos en México), se le antepone el default
  if (cleaned.length === 10) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }

  return cleaned;
}

// Genera la URL de WhatsApp con el mensaje personalizado y codificado
export function generateWhatsAppReminderUrl(student: StudentWhatsAppInfo): string {
  const formattedPhone = formatPhoneNumber(student.phone);
  
  const firstName = student.fullName.split(' ')[0];
  const className = student.assignedClass || 'tu taller de baile';
  const amountText = student.amountToPay ? `$${student.amountToPay} MXN` : 'tu colegiatura';
  const dueDateText = student.paymentDueDate ? `el día ${student.paymentDueDate} de este mes` : 'próximamente';

  const message = `Hola ${firstName} 👋✨ ¡Esperamos que estés teniendo un excelente día! 

Te escribimos para recordarte cordialmente sobre el pago de *${amountText}* correspondiente a *${className}*, cuyo vencimiento es *${dueDateText}*.

Si ya realizaste tu pago o transferencia, por favor reenvíanos tu comprobante por este medio para actualizar tu registro. ¡Muchas gracias y nos vemos en clase para seguir bailando! 💃🕺`;

  // Codificar el texto para la URL
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}