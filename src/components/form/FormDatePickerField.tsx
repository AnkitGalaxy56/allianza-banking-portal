import { Box, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormDatePickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  helperText?: string;
  size?: 'small' | 'medium';
}

/** Native date input wrapper. No MUI X package/date adapter is required. Values are YYYY-MM-DD strings. */
export default function FormDatePickerField<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  minDate,
  maxDate,
  helperText,
  size = 'small',
}: FormDatePickerFieldProps<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
            {label}{required ? ' *' : ''}
          </Typography>
          <TextField
            id={id}
            name={field.name}
            type="date"
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            fullWidth
            size={size}
            disabled={disabled}
            required={required}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
            inputProps={{ min: minDate, max: maxDate }}
          />
        </Box>
      )}
    />
  );
}
