import moment from 'moment'

/**
 * Format a number with locale-aware thousands separators.
 * e.g. 1234567 → "1,234,567"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('th-TH').format(n)
}

/**
 * Format a number as Thai Baht currency.
 * e.g. 1500 → "฿1,500.00"
 */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(n)
}

/**
 * Format a date string or Date object to a readable date.
 * e.g. "2025-03-21T00:00:00Z" → "21 มีนาคม 2568"
 */
export function formatDate(d: string | Date): string {
  return moment(d).format('DD MMM YYYY')
}

/**
 * Format a date as a relative time string.
 * e.g. "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(d: string | Date): string {
  return moment(d).fromNow()
}
