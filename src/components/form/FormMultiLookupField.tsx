import { Autocomplete, Box, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { SelectOption } from './FormSelectField';

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

/** Searchable multi-select lookup used by User Master fields such as Multi Branch Access. */
export default function FormMultiLookupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select one or more…',
  disabled,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];
        const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

        return (
          <Box>
            <Typography
              component="label"
              htmlFor={id}
              variant="body2"
              fontWeight={700}
              sx={{ display: 'block', mb: 0.75 }}
            >
              {label}
            </Typography>
            <Autocomplete<SelectOption, true, false, false>
              id={id}
              multiple
              limitTags={1}
              options={options}
              value={selectedOptions}
              disabled={disabled}
              fullWidth
              size="small"
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              onChange={(_event, selected) => field.onChange(selected.map((option) => option.value))}
              onBlur={field.onBlur}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  placeholder={selectedOptions.length ? '' : placeholder}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
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
