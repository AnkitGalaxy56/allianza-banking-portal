import { useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormPasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  size?: 'small' | 'medium';
  helperText?: string;
  showLabel?: boolean;
}

/** Password input with accessible show/hide toggle and React Hook Form integration. */
export default function FormPasswordField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  required,
  autoComplete = 'current-password',
  size = 'small',
  helperText,
  showLabel = true,
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          {showLabel && (
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}{required ? ' *' : ''}
            </Typography>
          )}
          <TextField
            id={id}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
            fullWidth
            size={size}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
            inputProps={!showLabel ? { 'aria-label': label } : undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible((current) => !current)}
                    edge="end"
                    size="small"
                    disabled={disabled}
                  >
                    {visible ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    />
  );
}
