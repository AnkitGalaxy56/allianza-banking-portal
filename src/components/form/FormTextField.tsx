import type { ReactNode } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  endAdornment?: ReactNode;
  size?: 'small' | 'medium';
  /** Set false when this field sits inside a labelled composite row, such as Employee Name. */
  showLabel?: boolean;
}

/** Label-above text field wired to React Hook Form. */
export default function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  disabled,
  autoFocus,
  endAdornment,
  size = 'medium',
  showLabel = true,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ minWidth: 0, width: '100%' }}>
          {showLabel && (
            <Typography
              component="label"
              htmlFor={id}
              variant="body2"
              fontWeight={700}
              sx={{ display: 'block', mb: 0.75 }}
            >
              {label}
            </Typography>
          )}
          <TextField
            id={id}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            autoFocus={autoFocus}
            fullWidth
            size={size}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            inputProps={!showLabel ? { 'aria-label': label } : undefined}
            InputProps={{
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : undefined,
            }}
          />
        </Box>
      )}
    />
  );
}
