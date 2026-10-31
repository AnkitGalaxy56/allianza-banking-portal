import type { ReactNode } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
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
  helperText?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  color?: 'primary' | 'secondary' | 'default' | 'success' | 'warning' | 'error' | 'info';
}

/** Reusable boolean switch for enabled/disabled preferences. */
export default function FormSwitchField<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  helperText,
  labelPlacement = 'end',
  color = 'primary',
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)} disabled={disabled}>
          <FormControlLabel
            label={label}
            labelPlacement={labelPlacement}
            control={(
              <Switch
                name={field.name}
                checked={Boolean(field.value)}
                onChange={(_event, checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                inputRef={field.ref}
                disabled={disabled}
                color={color}
              />
            )}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
