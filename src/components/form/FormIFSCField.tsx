import { Box, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormIFSCFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
}

/** IFSC input normalizes the value to uppercase. Put actual format/business validation in the feature schema. */
export default function FormIFSCField<T extends FieldValues>({
  name,
  control,
  label = 'IFSC code',
  placeholder = 'e.g. HDFC0001234',
  disabled,
  required,
  helperText = '11 characters; the fifth character is usually 0.',
}: FormIFSCFieldProps<T>) {
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
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value.toUpperCase().replace(/\s/g, '').slice(0, 11))}
            onBlur={field.onBlur}
            inputRef={field.ref}
            placeholder={placeholder}
            fullWidth
            size="small"
            disabled={disabled}
            required={required}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
            inputProps={{ maxLength: 11, autoCapitalize: 'characters', spellCheck: false }}
          />
        </Box>
      )}
    />
  );
}
