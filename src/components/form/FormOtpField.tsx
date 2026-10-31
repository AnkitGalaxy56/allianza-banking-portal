import { useRef } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormOtpFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  length?: number;
  disabled?: boolean;
  helperText?: string;
  autoFocus?: boolean;
}

/** Accessible segmented numeric OTP control. The form stores one string containing all digits. */
export default function FormOtpField<T extends FieldValues>({
  name,
  control,
  label = 'Verification code',
  length = 6,
  disabled,
  helperText = `Enter the ${length}-digit code.`,
  autoFocus = false,
}: FormOtpFieldProps<T>) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const safeLength = Math.min(Math.max(Math.floor(length), 1), 12);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? '').replace(/\D/g, '').slice(0, safeLength);
        const updateAt = (index: number, input: string) => {
          const digits = input.replace(/\D/g, '');
          const chars = value.padEnd(safeLength, ' ').split('');
          if (!digits) chars[index] = ' ';
          else {
            const inserted = digits.slice(-safeLength);
            inserted.split('').forEach((digit, offset) => {
              if (index + offset < safeLength) chars[index + offset] = digit;
            });
          }
          const nextValue = chars.join('').replace(/\s/g, '');
          field.onChange(nextValue);
          const focusIndex = !digits ? index : Math.min(index + digits.length, safeLength - 1);
          refs.current[focusIndex]?.focus();
        };

        return (
          <Box sx={{ width: '100%' }}>
            <Typography component="label" htmlFor={`${id}-0`} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.from({ length: safeLength }, (_, index) => (
                <TextField
                  key={`${id}-${index}`}
                  id={`${id}-${index}`}
                  inputRef={(element: HTMLInputElement | null) => { refs.current[index] = element; }}
                  value={value[index] ?? ''}
                  onChange={(event) => updateAt(index, event.target.value)}
                  onBlur={field.onBlur}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && !value[index] && index > 0) refs.current[index - 1]?.focus();
                    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
                    if (event.key === 'ArrowRight' && index < safeLength - 1) refs.current[index + 1]?.focus();
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                    updateAt(0, event.clipboardData.getData('text'));
                  }}
                  type="text"
                  size="small"
                  disabled={disabled}
                  autoFocus={autoFocus && index === 0}
                  error={Boolean(fieldState.error)}
                  inputProps={{ inputMode: 'numeric', maxLength: 1, 'aria-label': `${label} digit ${index + 1}` }}
                  sx={{ width: 48, '& input': { textAlign: 'center', fontWeight: 700, px: 0.5 } }}
                />
              ))}
            </Box>
            {(fieldState.error?.message || helperText) && (
              <Typography variant="caption" color={fieldState.error ? 'error' : 'text.secondary'} sx={{ display: 'block', mt: 0.75 }}>
                {fieldState.error?.message ?? helperText}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}
