/**
 * Format date to French format (JJ/MM/AAAA)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date and time to French format (JJ/MM/AAAA HH:MM)
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Format Canadian postal code (A1A1A1 -> A1A 1A1)
 */
export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return cleaned;
}

/**
 * Normalize postal code for storage (remove spaces and hyphens)
 */
export function normalizePostalCode(postalCode: string): string {
  return postalCode.replace(/[ -]/g, '').toUpperCase();
}
