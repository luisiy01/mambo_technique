// lib/whatsapp.ts

export interface StudentWhatsAppInfo {
  fullName: string;
  phone: string;
  assignedClass?: string;
  paymentDueDate?: number;
  amountToPay?: number;
  academyName?: string;
  bankName?: string;
  bankAccount?: string;
  clabe?: string;
}

export function formatPhoneNumber(phone: string, defaultCountryCode = '52'): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }
  return cleaned;
}

export function generateWhatsAppReminderUrl(student: StudentWhatsAppInfo): string {
  const formattedPhone = formatPhoneNumber(student.phone);
  
  const firstName = student.fullName.split(' ')[0];
  const academyName = student.academyName || 'la academia';
  const className = student.assignedClass || 'tu taller de baile';
  const amountText = student.amountToPay ? `$${student.amountToPay} MXN` : 'tu colegiatura';
  const dueDateText = student.paymentDueDate ? `el día ${student.paymentDueDate} de este mes` : 'próximamente';

  let bankSection = '';
  if (student.clabe || student.bankAccount) {
    bankSection = `\n\n💳 *Datos para transferencia/SPEI:*\n` +
      (student.bankName ? `• Banco: ${student.bankName}\n` : '') +
      (student.clabe ? `• CLABE: ${student.clabe}\n` : '') +
      (student.bankAccount ? `• Cuenta: ${student.bankAccount}\n` : '');
  }

  const message = `Hola ${firstName} 👋✨ ¡Esperamos que estés teniendo un excelente día!

Te escribimos de *${academyName}* para recordarte cordialmente sobre el pago de *${amountText}* correspondiente a *${className}*, cuyo vencimiento es *${dueDateText}*.${bankSection}

Si ya realizaste tu pago o transferencia, por favor reenvíanos tu comprobante por este medio para actualizar tu registro. ¡Muchas gracias y nos vemos en clase! 💃🕺`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}