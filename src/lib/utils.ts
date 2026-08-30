import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhoneNumber(phone: string): string {
  const digits = cleanPhoneNumber(phone);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const num = digits.slice(4);
    if (num.length === 9) {
      return `+55 (${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
    }
  }
  return phone;
}

export interface WhatsAppOrderPayload {
  storeName: string;
  customerName: string;
  observation?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export function generateWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const itemsText = payload.items
    .map(item => `${item.quantity}x ${item.name} — ${formatBRL(item.price * item.quantity)}`)
    .join('\n');

  let message = `Olá! Gostaria de fazer um pedido na ${payload.storeName || 'SN TECHNO'}.\n\n`;
  message += `*PEDIDO*\n\n`;
  message += `${itemsText}\n\n`;
  message += `*TOTAL: ${formatBRL(payload.total)}*\n\n`;
  message += `Cliente: ${payload.customerName.trim()}\n`;

  if (payload.observation && payload.observation.trim()) {
    message += `\nObservação:\n${payload.observation.trim()}\n`;
  }

  return message;
}

export function createWhatsAppLink(phoneNumber: string, message: string = ''): string {
  let cleaned = cleanPhoneNumber(phoneNumber || '85920094668');
  // Default to Brazil country code 55 if not provided
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }
  const encoded = encodeURIComponent(message);
  return encoded ? `https://wa.me/${cleaned}?text=${encoded}` : `https://wa.me/${cleaned}`;
}

export function getInstagramUrl(handleOrUrl?: string): string {
  if (!handleOrUrl || !handleOrUrl.trim()) {
    return 'https://www.instagram.com/sntechno_aracape?igsi=MTh2eXBtN3VqM2Z1bg==';
  }
  const clean = handleOrUrl.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  return `https://www.instagram.com/${clean.replace('@', '')}`;
}
