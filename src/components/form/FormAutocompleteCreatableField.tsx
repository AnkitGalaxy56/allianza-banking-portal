import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { SelectOption } from './FormSelectField';

export interface FormAutocompleteCreatableFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
}

/** Search options or type a custom string. Use only for fields whose business rules allow custom values. */
export default function FormAutocompleteCreatableField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select or type a value…',
  disabled,
  helperText,
  required,
}: FormAutocompleteCreatableFieldProps<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = String(field.value ?? '');
        const selectedOption = options.find((option) => option.value === currentValue) ?? null;
        const value: SelectOption | string | null = selectedOption ?? (currentValue || null);
        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}{required ? ' *' : ''}
            </Typography>
            <Autocomplete<SelectOption, false, false, true>
              id={id}
              freeSolo
              options={options}
              value={value}
              disabled={disabled}
              fullWidth
              size="small"
              isOptionEqualToValue={(option, selected) => typeof selected !== 'string' && option.value === selected.value}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              onChange={(_event, option) => field.onChange(typeof option === 'string' ? option : option?.value ?? '')}
              onInputChange={(_event, inputValue, reason) => {
                if (reason === 'input') field.onChange(inputValue);
                if (reason === 'clear') field.onChange('');
              }}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  placeholder={placeholder}
                  required={required}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message ?? helperText}
                />
              )}
            />
          </Box>
        );
      }}
    />
  );
}
