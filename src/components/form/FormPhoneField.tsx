import { useState } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface PhoneCountryOption {
  value: string;
  label: string;
}

export const DEFAULT_PHONE_COUNTRIES: PhoneCountryOption[] = [
  { value: '+91', label: 'India (+91)' },
  { value: '+1', label: 'USA/Canada (+1)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+971', label: 'UAE (+971)' },
];

export interface FormPhoneFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  countryOptions?: PhoneCountryOption[];
  defaultCountryCode?: string;
  /** e164 stores e.g. +919876543210; national stores digits only. */
  valueFormat?: 'e164' | 'national';
  helperText?: string;
}

/** Phone input with a calling-code selector. Default stored format is E.164-like (+countryCode + digits). */
export default function FormPhoneField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Enter phone number',
  disabled,
  required,
  countryOptions = DEFAULT_PHONE_COUNTRIES,
  defaultCountryCode = '+91',
  valueFormat = 'e164',
  helperText,
}: FormPhoneFieldProps<T>) {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = String(field.value ?? '');
        const matchedCountry = valueFormat === 'e164'
          ? [...countryOptions].sort((a, b) => b.value.length - a.value.length).find((option) => currentValue.startsWith(option.value))
          : undefined;
        const activeCode = matchedCountry?.value ?? countryCode;
        const nationalNumber = valueFormat === 'e164' && matchedCountry
          ? currentValue.slice(matchedCountry.value.length).replace(/\D/g, '')
          : currentValue.replace(/\D/g, '');

        const updatePhone = (code: string, digits: string) => {
          const normalized = digits.replace(/\D/g, '').slice(0, 15);
          field.onChange(!normalized ? '' : valueFormat === 'e164' ? `${code}${normalized}` : normalized);
        };

        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}{required ? ' *' : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, minWidth: 0 }}>
              <FormControl size="small" disabled={disabled} sx={{ width: 142, flexShrink: 0 }}>
                <Select
                  value={activeCode}
                  onChange={(event) => {
                    const nextCode = String(event.target.value);
                    setCountryCode(nextCode);
                    updatePhone(nextCode, nationalNumber);
                  }}
                  inputProps={{ 'aria-label': `${label} country calling code` }}
                >
                  {countryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id={id}
                name={field.name}
                value={nationalNumber}
                onChange={(event) => updatePhone(activeCode, event.target.value)}
                onBlur={field.onBlur}
                inputRef={field.ref}
                placeholder={placeholder}
                type="tel"
                fullWidth
                size="small"
                disabled={disabled}
                required={required}
                inputProps={{ inputMode: 'numeric', maxLength: 15, 'aria-label': label }}
                error={Boolean(fieldState.error)}
              />
            </Box>
            {(fieldState.error?.message || helperText) && (
              <Typography variant="caption" color={fieldState.error ? 'error' : 'text.secondary'} sx={{ display: 'block', mt: 0.5 }}>
                {fieldState.error?.message ?? helperText}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}
