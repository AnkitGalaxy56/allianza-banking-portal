import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  /** Render a label above the control instead of floating it inside the outline. */
  labelAbove?: boolean;
}

/** Select field with the same React Hook Form validation behavior as FormTextField. */
export default function FormSelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  labelAbove = false,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ minWidth: 0, width: '100%' }}>
          {labelAbove && (
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
          <FormControl fullWidth size="small" error={Boolean(fieldState.error)} disabled={disabled}>
            {!labelAbove && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
            <Select
              {...field}
              id={id}
              labelId={!labelAbove ? `${id}-label` : undefined}
              label={!labelAbove ? label : undefined}
              displayEmpty={labelAbove}
              inputProps={{ 'aria-label': label }}
              value={field.value ?? ''}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {fieldState.error?.message && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        </Box>
      )}
    />
  );
}
