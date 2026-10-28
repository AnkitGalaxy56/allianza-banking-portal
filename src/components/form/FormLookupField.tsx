import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material';
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

/** Searchable lookup/dropdown field styled consistently with the other form fields. */
export default function FormLookupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select or search…',
  disabled,
}: Props<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((option) => option.value === String(field.value ?? '')) ?? null;

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
            <Autocomplete<SelectOption, false, false, false>
              id={id}
              options={options}
              value={selectedOption}
              disabled={disabled}
              fullWidth
              size="small"
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              onChange={(_event, option) => field.onChange(option?.value ?? '')}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  placeholder={placeholder}
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
