import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  required?: boolean;
  /** Render a label above the control instead of a floating label. */
  labelAbove?: boolean;
  /** Placeholder used when labelAbove is true and no value is selected. */
  placeholder?: string;
  helperText?: string;
}

/** Standard select field connected to React Hook Form. */
export default function FormSelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  required,
  labelAbove = false,
  placeholder = 'Select an option',
  helperText,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const labelId = `${id}-label`;

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
              {required ? ' *' : ''}
            </Typography>
          )}
          <FormControl
            fullWidth
            size="small"
            error={Boolean(fieldState.error)}
            disabled={disabled}
            required={required}
          >
            {!labelAbove && <InputLabel id={labelId}>{label}</InputLabel>}
            <Select
              {...field}
              id={id}
              labelId={!labelAbove ? labelId : undefined}
              label={!labelAbove ? label : undefined}
              displayEmpty={labelAbove}
              inputProps={{ 'aria-label': label }}
              value={field.value ?? ''}
              renderValue={(selected) => {
                if (selected === '' || selected === undefined || selected === null) {
                  return labelAbove ? (
                    <Typography component="span" color="text.disabled">
                      {placeholder}
                    </Typography>
                  ) : '';
                }
                return options.find((option) => option.value === selected)?.label ?? String(selected);
              }}
            >
              {labelAbove && (
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(fieldState.error?.message || helperText) && (
              <FormHelperText>
                {fieldState.error?.message ?? helperText}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  );
}
