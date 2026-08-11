import { randomBytes } from 'node:crypto';

export function createTrackingCode(prefix: 'CON' | 'REC', date = new Date()): string {
  const year = date.getUTCFullYear();
  const token = randomBytes(6).toString('hex').toUpperCase();
  return `KQ-${prefix}-${String(year)}-${token}`;
}
