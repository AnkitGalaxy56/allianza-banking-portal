import type { RequestModuleConfig } from './types';

export type RequestFieldErrors = Record<string, string>;

/** Validates required values and common banking field formats before create/edit submission. */
export function validateRequestForm(fields: Record<string, unknown>, required: readonly string[]): RequestFieldErrors {
  const errors: RequestFieldErrors = {};
  for (const key of required) {
    if (!String(fields[key] ?? '').trim()) errors[key] = 'This field is required.';
  }
  for (const [rawKey, rawValue] of Object.entries(fields)) {
    const key = rawKey.toLowerCase();
    const value = String(rawValue ?? '').trim();
    if (!value || errors[rawKey]) continue;
    if (key.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[rawKey] = 'Enter a valid email address.';
    else if ((key.includes('mobile') || key.includes('phone')) && !/^[+]?[0-9\s-]{7,15}$/.test(value)) errors[rawKey] = 'Enter a valid phone number.';
    else if (/(amount|balance|income|expense|outstanding|instalment|installment|tenure|count)/.test(key) && (!Number.isFinite(Number(value)) || Number(value) < 0)) errors[rawKey] = 'Enter a valid non-negative number.';
    else if (key.endsWith('date') && Number.isNaN(Date.parse(value))) errors[rawKey] = 'Enter a valid date.';
  }
  return errors;
}

export function validateRequestFields(fields: Record<string, string>, required: readonly string[]): boolean {
  return Object.keys(validateRequestForm(fields, required)).length === 0;
}
export function assertModuleConfig(config: RequestModuleConfig): RequestModuleConfig { return config; }
