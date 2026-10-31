import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { SelectOption } from './FormSelectField';

export interface FormAsyncLookupFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  loadOptions: (query: string) => Promise<SelectOption[]>;
  placeholder?: string;
  disabled?: boolean;
  minSearchLength?: number;
  debounceMs?: number;
  helperText?: string;
  noOptionsText?: string;
}

/** Server-backed searchable select. Provide a memoized loadOptions function from the feature/container. */
export default function FormAsyncLookupField<T extends FieldValues>({
  name,
  control,
  label,
  loadOptions,
  placeholder = 'Type to search…',
  disabled,
  minSearchLength = 0,
  debounceMs = 300,
  helperText,
  noOptionsText = 'No options found',
}: FormAsyncLookupFieldProps<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!open || query.trim().length < minSearchLength) {
      setOptions([]);
      setLoading(false);
      setLoadError('');
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setLoadError('');
      try {
        const result = await loadOptions(query.trim());
        if (!cancelled) setOptions(result);
      } catch (error) {
        if (!cancelled) {
          setOptions([]);
          setLoadError(error instanceof Error ? error.message : 'Unable to load options.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, query, minSearchLength, debounceMs, loadOptions]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValue = String(field.value ?? '');
        const selectedOption = options.find((option) => option.value === selectedValue)
          ?? (selectedValue ? { value: selectedValue, label: selectedValue } : null);
        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}
            </Typography>
            <Autocomplete<SelectOption, false, false, false>
              id={id}
              options={options}
              value={selectedOption}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              inputValue={query}
              onInputChange={(_event, value, reason) => {
                if (reason === 'input' || reason === 'clear') setQuery(value);
              }}
              loading={loading}
              disabled={disabled}
              fullWidth
              size="small"
              filterOptions={(items) => items}
              noOptionsText={loadError || (query.trim().length < minSearchLength ? `Type at least ${minSearchLength} characters` : noOptionsText)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
              onChange={(_event, option) => {
                field.onChange(option?.value ?? '');
                setQuery(option?.label ?? '');
              }}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  placeholder={placeholder}
                  error={Boolean(fieldState.error) || Boolean(loadError)}
                  helperText={fieldState.error?.message ?? (loadError || helperText)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={18} /> : <InputAdornment position="end"><SearchOutlinedIcon fontSize="small" color="action" /></InputAdornment>}
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
