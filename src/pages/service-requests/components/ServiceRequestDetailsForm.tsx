import { useEffect } from 'react';
import { Alert, Box, Button, Divider, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceRequestUpdateSchema, type ServiceRequestUpdateValues } from '../schemas/serviceRequestSchema';
import type { ServiceRequest } from '../types/serviceRequest';
import StatusChip from '@/components/common/StatusChip';

interface Props {
  request: ServiceRequest;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (values: ServiceRequestUpdateValues) => void;
}
export default function ServiceRequestDetailsForm({ request, saving, error, onClose, onSave }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } =
    useForm<ServiceRequestUpdateValues>({
      resolver: zodResolver(serviceRequestUpdateSchema),
      defaultValues: { status: request.status, note: request.note },
    });
  useEffect(() => reset({ status: request.status, note: request.note }), [request, reset]);
  return <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight={800}>{request.id}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <StatusChip status={request.status} />
        <IconButton aria-label="Close details" onClick={onClose} size="small">
          <CloseOutlinedIcon />
        </IconButton>
      </Stack>
    </Stack>
    {error && <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>}
    {([['Customer', request.customer],
    ['Request type', request.type],
    ['Branch', request.branch],
    ['Submitted', request.submitted],
    ...(request.leavesRequested ? [['Leaves requested', String(request.leavesRequested)]] : [])] as string[][]).map(([label, value]) => <Stack key={label} direction="row" justifyContent="space-between" gap={2} sx={{ py: 1.35 }}><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="body2" fontWeight={650} textAlign="right">{value}</Typography></Stack>)}
    <Divider sx={{ my: 1 }} />
    <Box component="form" onSubmit={handleSubmit(onSave)} noValidate>
      <Controller
        name="status"
        control={control}
        render={({ field }) => <TextField
          {...field}
          select label="Update status"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          disabled={saving}>
          {[['new', 'New'],
          ['in_review', 'In review'], ['completed', 'Completed'], ['rejected', 'Rejected']].map(([value, label]) =>
            <MenuItem
              key={value}
              value={value}>
              {label}
            </MenuItem>)}
        </TextField>} />
      <Controller name="note"
        control={control}
        render={({ field }) =>
          <TextField {...field}
            label="Note for the customer"
            placeholder="Optional message shown in the app"
            multiline
            minRows={3}
            fullWidth
            size="small"
            disabled={saving}
            error={!!errors.note}
            helperText={errors.note?.message ?? 'Optional · maximum 500 characters'} />} />
      <Stack
        direction="row"
        spacing={1}
        mt={2}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save update'}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={saving}
        >
          Close
        </Button>
      </Stack>
    </Box>
  </Paper>;
}
