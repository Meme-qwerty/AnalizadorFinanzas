import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es })
}

export function formatDateRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function formatPercentage(value: number): string {
  return value.toFixed(1) + '%'
}

export function formatCompactCLP(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`
  }
  return formatCLP(amount)
}
