import { useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormCurrencyFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  currencySymbol?: string;
  decimalPlaces?: number;
  allowNegative?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  /** Default keeps decimal input as a string to avoid floating-point rounding. */
  valueAsNumber?: boolean;
}

/** Currency-amount input with decimal filtering. Currency-specific limits belong in the feature schema. */
export default function FormCurrencyField<T extends FieldValues>({
  name,
  control,
  label,
  currencySymbol = '₹',
  decimalPlaces = 2,
  allowNegative = false,
  disabled,
  required,
  helperText,
  valueAsNumber = false,
}: FormCurrencyFieldProps<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const [isFocused, setIsFocused] = useState(false);

  const normalize = (input: string): string => {
    let value = input.replace(/,/g, '').replace(/[^\d.\-]/g, '');
    if (!allowNegative) value = value.replace(/-/g, '');
    else value = value.replace(/(?!^)-/g, '');
    const negative = value.startsWith('-') ? '-' : '';
    value = value.replace(/-/g, '');
    const [whole = '', ...fractionParts] = value.split('.');
    const fraction = fractionParts.join('').slice(0, Math.max(0, decimalPlaces));
    const hasDecimal = value.includes('.') && decimalPlaces > 0;
    return `${negative}${whole}${hasDecimal ? `.${fraction}` : ''}`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const rawValue = field.value === null || field.value === undefined ? '' : String(field.value);
        const displayValue = !isFocused && rawValue !== '' && Number.isFinite(Number(rawValue))
          ? Number(rawValue).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: decimalPlaces })
          : rawValue;
        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}{required ? ' *' : ''}
            </Typography>
            <TextField
              id={id}
              name={field.name}
              value={displayValue}
              onChange={(event) => {
                const normalized = normalize(event.target.value);
                field.onChange(valueAsNumber && normalized !== '' && normalized !== '-' ? Number(normalized) : normalized);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => { setIsFocused(false); field.onBlur(); }}
              inputRef={field.ref}
              fullWidth
              size="small"
              disabled={disabled}
              required={required}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? helperText}
              inputProps={{ inputMode: 'decimal', 'aria-label': label }}
              InputProps={{ startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment> }}
            />
          </Box>
        );
      }}
    />
  );
}
