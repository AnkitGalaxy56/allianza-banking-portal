import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface SelectOption { value: string; label: string }

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}

/** Select field with the same React Hook Form validation behavior as FormTextField. */
export default function FormSelectField<T extends FieldValues>({ name, control, label, options, disabled }: Props<T>) {
  const id = `field-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth size="small" error={Boolean(fieldState.error)} disabled={disabled}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <Select {...field} labelId={`${id}-label`} id={id} label={label} value={field.value ?? ''}>
            {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
          </Select>
          {fieldState.error?.message && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
