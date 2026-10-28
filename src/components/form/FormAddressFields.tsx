import { Grid } from '@mui/material';
import { type Control, type FieldValues, type Path } from 'react-hook-form';
import FormTextField from './FormTextField';
import FormSection from './FormSection';

export interface AddressFieldNames<T extends FieldValues> {
  addressLine1: Path<T>;
  addressLine2?: Path<T>;
  city: Path<T>;
  state: Path<T>;
  postalCode: Path<T>;
  country: Path<T>;
}

export interface FormAddressFieldsProps<T extends FieldValues> {
  control: Control<T>;
  names: AddressFieldNames<T>;
  title?: string;
  disabled?: boolean;
  requiredFields?: Array<keyof AddressFieldNames<T>>;
}

/** Reusable address block; use the feature's schema for country/postal-code-specific validation. */
export default function FormAddressFields<T extends FieldValues>({
  control,
  names,
  title = 'Address',
  disabled,
  requiredFields = ['addressLine1', 'city', 'state', 'postalCode', 'country'],
}: FormAddressFieldsProps<T>) {
  const required = (key: keyof AddressFieldNames<T>) => requiredFields.includes(key);
  return (
    <FormSection title={title} divider>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormTextField<T> name={names.addressLine1} control={control} label="Address line 1" placeholder="House/building, street" disabled={disabled} required={required('addressLine1')} autoComplete="address-line1" />
        </Grid>
        {names.addressLine2 && (
          <Grid item xs={12}>
            <FormTextField<T> name={names.addressLine2} control={control} label="Address line 2" placeholder="Area, landmark (optional)" disabled={disabled} required={required('addressLine2')} autoComplete="address-line2" />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormTextField<T> name={names.city} control={control} label="City" disabled={disabled} required={required('city')} autoComplete="address-level2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField<T> name={names.state} control={control} label="State / Province" disabled={disabled} required={required('state')} autoComplete="address-level1" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField<T> name={names.postalCode} control={control} label="Postal code" disabled={disabled} required={required('postalCode')} autoComplete="postal-code" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField<T> name={names.country} control={control} label="Country" disabled={disabled} required={required('country')} autoComplete="country-name" />
        </Grid>
      </Grid>
    </FormSection>
  );
}
