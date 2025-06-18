import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns'

export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM yyyy')
}

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd MMM yyyy HH:mm')
}

export const getDateRange = (period: 'daily' | 'weekly' | 'monthly', date: Date = new Date()) => {
  switch (period) {
    case 'daily':
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      }
    case 'weekly':
      return {
        start: startOfWeek(date),
        end: endOfWeek(date)
      }
    case 'monthly':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      }
    default:
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      }
  }
}
