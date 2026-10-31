export interface ProfileField {
  label: string;
  value: string;
}

export const displayValue = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined || value === '') return 'Not added';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};
