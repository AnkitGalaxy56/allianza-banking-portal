import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  labelAbove?: boolean;
  helperText?: string;
  noOptionsText?: string;
  clearOnEscape?: boolean;
}

/** Searchable single-select lookup. Use for Branch, Role, System Role, etc. */
export default function FormLookupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select or search…',
  disabled,
  required,
  labelAbove = true,
  helperText,
  noOptionsText = 'No options found',
  clearOnEscape = true,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const labelId = `${id}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          (option) => option.value === String(field.value ?? ''),
        ) ?? null;

        return (
          <Box sx={{ minWidth: 0, width: '100%' }}>
            {labelAbove && (
              <Typography
                component="label"
                id={labelId}
                htmlFor={id}
                variant="body2"
                fontWeight={700}
                sx={{ display: 'block', mb: 0.75 }}
              >
                {label}
                {required ? ' *' : ''}
              </Typography>
            )}
            <Autocomplete<SelectOption, false, false, false>
              id={id}
              options={[...options]}
              value={selectedOption}
              disabled={disabled}
              fullWidth
              size="small"
              clearOnEscape={clearOnEscape}
              noOptionsText={noOptionsText}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              getOptionDisabled={(option) => Boolean(option.disabled)}
              onChange={(_event, option) => field.onChange(option?.value ?? '')}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  label={!labelAbove ? label : undefined}
                  placeholder={placeholder}
                  required={required}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message ?? helperText}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <InputAdornment position="end" sx={{ mr: 0.25 }}>
                          <SearchOutlinedIcon fontSize="small" color="action" />
                        </InputAdornment>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        );
      }}
    />
  );
}
