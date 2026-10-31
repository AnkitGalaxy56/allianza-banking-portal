import {
  Autocomplete,
  Box,
  Chip,
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
  limitTags?: number;
  maxSelections?: number;
  noOptionsText?: string;
}

/** Searchable multi-select lookup; the form value is stored as string[]. */
export default function FormMultiLookupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select one or more…',
  disabled,
  required,
  labelAbove = true,
  helperText,
  limitTags = 1,
  maxSelections,
  noOptionsText = 'No options found',
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const labelId = `${id}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value.filter((value: unknown): value is string => typeof value === 'string')
          : [];
        const selectedOptions = options.filter((option) =>
          selectedValues.includes(option.value),
        );
        const reachedLimit = maxSelections !== undefined && selectedOptions.length >= maxSelections;

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
            <Autocomplete<SelectOption, true, false, false>
              id={id}
              multiple
              limitTags={limitTags}
              options={[...options]}
              value={selectedOptions}
              disabled={disabled}
              fullWidth
              size="small"
              disableCloseOnSelect
              noOptionsText={noOptionsText}
              getOptionDisabled={(option) =>
                Boolean(option.disabled) ||
                (reachedLimit && !selectedValues.includes(option.value))
              }
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              onChange={(_event, selected) =>
                field.onChange(selected.map((option) => option.value))
              }
              onBlur={field.onBlur}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                    sx={{ maxWidth: 150 }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  label={!labelAbove ? label : undefined}
                  placeholder={selectedOptions.length ? '' : placeholder}
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
