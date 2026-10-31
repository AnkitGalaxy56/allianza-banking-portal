import type { ReactNode } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: ReactNode;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
}

/** Reusable boolean checkbox for access permissions and form preferences. */
export default function FormCheckboxField<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  helperText,
  size = 'small',
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)} required={required} disabled={disabled}>
          <FormControlLabel
            control={(
              <Checkbox
                name={field.name}
                checked={Boolean(field.value)}
                onChange={(_event, checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                inputRef={field.ref}
                disabled={disabled}
                required={required}
                size={size}
              />
            )}
            label={label}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
