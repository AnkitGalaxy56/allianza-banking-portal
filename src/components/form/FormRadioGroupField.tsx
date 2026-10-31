import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { SelectOption } from './FormSelectField';

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  required?: boolean;
  row?: boolean;
  helperText?: string;
}

/** Reusable radio group for short mutually-exclusive choices. */
export default function FormRadioGroupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  required,
  row = false,
  helperText,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          component="fieldset"
          error={Boolean(fieldState.error)}
          disabled={disabled}
          required={required}
        >
          <FormLabel component="legend" id={`${id}-label`}>
            {label}
          </FormLabel>
          <RadioGroup
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-labelledby={`${id}-label`}
            row={row}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={disabled || option.disabled}
                control={<Radio inputRef={field.ref} size="small" />}
              />
            ))}
          </RadioGroup>
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
