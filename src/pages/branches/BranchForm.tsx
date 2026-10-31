import { useEffect, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormTextField from '@/components/form/FormTextField';
import { getErrorMessage } from '@/services/api/apiError';
import { branchService } from '@/services/branch.service';
import type { Branch } from '@/types/branch';
import { branchSchema, branchToFormValues, EMPTY_BRANCH, type BranchFormValues } from './branchSchema';

interface Props {
  editing: Branch | null;
  focusSignal: number;
  onSaved: (branch: Branch, mode: 'created' | 'updated') => void;
  onCancel: () => void;
}

export default function BranchForm({ editing, focusSignal, onSaved, onCancel }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit, reset, setFocus, formState } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: EMPTY_BRANCH,
  });

  useEffect(() => {
    reset(editing ? branchToFormValues(editing) : EMPTY_BRANCH);
    setSubmitError(null);
  }, [editing, reset]);

  useEffect(() => {
    if (focusSignal > 0) setFocus('name');
  }, [focusSignal, setFocus]);

  const onSubmit = async (values: BranchFormValues) => {
    setSubmitError(null);
    const payload = { ...values, ifsc: values.ifsc.toUpperCase(), code: values.code.toUpperCase() };
    try {
      const saved = editing
        ? await branchService.update(editing.id, payload)
        : await branchService.create(payload);
      onSaved(saved, editing ? 'updated' : 'created');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  const busy = formState.isSubmitting;
  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, pt: 1 }}>
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <FormTextField<BranchFormValues> name="name" control={control} label="Branch name" placeholder="Enter branch name" disabled={busy} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <FormTextField<BranchFormValues> name="code" control={control} label="Branch code" placeholder="Unique branch code" disabled={busy} />
        <FormTextField<BranchFormValues> name="ifsc" control={control} label="IFSC code" placeholder="11-character IFSC" disabled={busy} />
      </Box>
      <FormTextField<BranchFormValues> name="address" control={control} label="Address" placeholder="Street, area" disabled={busy} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <FormTextField<BranchFormValues> name="city" control={control} label="City" placeholder="City" disabled={busy} />
        <FormTextField<BranchFormValues> name="pincode" control={control} label="Pincode" placeholder="6-digit pincode" disabled={busy} />
      </Box>
      <FormTextField<BranchFormValues> name="phone" control={control} label="Branch phone" placeholder="Phone number" disabled={busy} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
        <Button variant="outlined" color="inherit" size="small" disabled={busy} onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" size="small" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save Changes' : 'Create Branch'}</Button>
      </Box>
    </Box>
  );
}
