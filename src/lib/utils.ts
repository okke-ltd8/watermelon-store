import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, length = 100) {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  WAITING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
  PROCESSING: 'Em produção',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

export const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  WAITING_PAYMENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-200 text-green-900',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
}
