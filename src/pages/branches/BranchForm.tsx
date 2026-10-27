import { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper, Typography, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormTextField from '@/components/form/FormTextField';
import { getErrorMessage } from '@/services/api/apiError';
import { branchService } from '@/services/branch.service';
import type { Branch } from '@/types/branch';
import { branchSchema, branchToFormValues, EMPTY_BRANCH, type BranchFormValues } from './branchSchema';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
interface Props {
  /** Branch being edited, or null when adding a new one */
  editing: Branch | null;
  /** Changes every time the "Add branch" button is clicked, to move focus into the form */
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
      reset(EMPTY_BRANCH);
      onSaved(saved, editing ? 'updated' : 'created');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  const busy = formState.isSubmitting;

  return (
    <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>


      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Typography variant="h6" fontWeight={800}>  {editing ? 'Edit branch' : 'Add branch'}</Typography>
        <Button aria-label="Close form" color="inherit" size="small" onClick={onCancel} sx={{ minWidth: 36 }}>
          <CloseOutlinedIcon fontSize="small" />
        </Button>

      </Stack>




      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        <FormTextField<BranchFormValues>
          name="name"
          control={control}
          label="Branch name"
          placeholder="Enter branch name"
          disabled={busy} /
        >
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
          <FormTextField<BranchFormValues> name="code" control={control} label="Branch code" placeholder="Unique code" disabled={busy} />
          <FormTextField<BranchFormValues> name="ifsc" control={control} label="IFSC code" placeholder="11-character IFSC" disabled={busy} />
        </Box>
        <FormTextField<BranchFormValues> name="address" control={control} label="Address" placeholder="Street, area" disabled={busy} />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
          <FormTextField<BranchFormValues> name="city" control={control} label="City" placeholder="City" disabled={busy} />
          <FormTextField<BranchFormValues> name="pincode" control={control} label="Pincode" placeholder="6-digit pincode" disabled={busy} />
        </Box>
        <FormTextField<BranchFormValues> name="phone" control={control} label="Branch phone" placeholder="Phone number" disabled={busy} />

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr', mt: 0.5 }}>
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? 'Saving…' : 'Save branch'}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            disabled={busy}
            onClick={() => {
              reset(EMPTY_BRANCH);
              setSubmitError(null);
              onCancel();
            }}
            sx={{ borderColor: 'divider' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
