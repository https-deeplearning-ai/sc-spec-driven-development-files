export function sanitizeInput(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
