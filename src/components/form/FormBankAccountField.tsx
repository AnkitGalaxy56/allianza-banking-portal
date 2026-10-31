import { Grid } from '@mui/material';
import { type Control, type FieldValues, type Path } from 'react-hook-form';
import FormTextField from './FormTextField';
import FormSection from './FormSection';

export interface FormBankAccountFieldProps<T extends FieldValues> {
  control: Control<T>;
  accountHolderName: Path<T>;
  accountNumber: Path<T>;
  title?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
}

/** Composite bank-account block. Account numbers are kept as strings to preserve leading zeroes. */
export default function FormBankAccountField<T extends FieldValues>({
  control,
  accountHolderName,
  accountNumber,
  title = 'Bank account details',
  description,
  disabled,
  required,
}: FormBankAccountFieldProps<T>) {
  return (
    <FormSection title={title} description={description} divider={false} spacing={1.5}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormTextField<T>
            name={accountHolderName}
            control={control}
            label="Account holder name"
            placeholder="Name as registered with bank"
            autoComplete="name"
            disabled={disabled}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<T>
            name={accountNumber}
            control={control}
            label="Bank account number"
            placeholder="Enter account number"
            autoComplete="off"
            inputMode="numeric"
            disabled={disabled}
            required={required}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
}
