import { Box, Grid, TextField, Typography } from '@mui/material';
import { Controller, useWatch, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface FormDateRangeFieldProps<T extends FieldValues> {
  control: Control<T>;
  startName: Path<T>;
  endName: Path<T>;
  label?: string;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
  required?: boolean;
}

/** Two controlled native date fields. It flags an end date earlier than the start date. */
export default function FormDateRangeField<T extends FieldValues>({
  control,
  startName,
  endName,
  label = 'Date range',
  startLabel = 'Start date',
  endLabel = 'End date',
  disabled,
  required,
}: FormDateRangeFieldProps<T>) {
  const startValue = String(useWatch({ control, name: startName }) ?? '');
  const endValue = String(useWatch({ control, name: endName }) ?? '');
  const invalidRange = Boolean(startValue && endValue && endValue < startValue);

  const renderDate = (name: Path<T>, fieldLabel: string, min?: string, max?: string, showRangeError = false) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const id = `field-${String(name).replace(/\./g, '-')}`;
        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {fieldLabel}{required ? ' *' : ''}
            </Typography>
            <TextField
              id={id}
              name={field.name}
              type="date"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              fullWidth
              size="small"
              disabled={disabled}
              required={required}
              error={Boolean(fieldState.error) || (showRangeError && invalidRange)}
              helperText={fieldState.error?.message ?? (showRangeError && invalidRange ? 'End date must be on or after start date.' : undefined)}
              inputProps={{ min, max }}
            />
          </Box>
        );
      }}
    />
  );

  return (
    <Box sx={{ width: '100%' }}>
      {label && <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.25 }}>{label}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>{renderDate(startName, startLabel, undefined, endValue || undefined)}</Grid>
        <Grid item xs={12} sm={6}>{renderDate(endName, endLabel, startValue || undefined, undefined, true)}</Grid>
      </Grid>
    </Box>
  );
}
