import type { ReactNode } from 'react';
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

export interface FormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  readOnly?: boolean;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  size?: 'small' | 'medium';
  /** Hide the label above the input when used inside a labelled composite row. */
  showLabel?: boolean;
  /** Supports notes/comments without needing a separate Controller in the page. */
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  maxLength?: number;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  helperText?: ReactNode;
}

/** Reusable React Hook Form text input. Defaults to small sizing to match MUI selects. */
export default function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  disabled,
  autoFocus,
  required,
  readOnly,
  endAdornment,
  startAdornment,
  size = 'small',
  showLabel = true,
  multiline = false,
  minRows,
  maxRows,
  rows,
  maxLength,
  inputMode,
  helperText,
}: FormTextFieldProps<T>) {
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
              {required ? ' *' : ''}
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
            required={required}
            fullWidth
            size={size}
            multiline={multiline}
            minRows={minRows}
            maxRows={maxRows}
            rows={rows}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
            inputProps={{
              ...(maxLength !== undefined ? { maxLength } : {}),
              ...(inputMode ? { inputMode } : {}),
              ...(readOnly ? { readOnly: true } : {}),
              ...(!showLabel ? { 'aria-label': label } : {}),
            }}
            InputProps={{
              startAdornment: startAdornment ? (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              ) : undefined,
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
