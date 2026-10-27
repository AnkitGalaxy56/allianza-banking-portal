import { useEffect } from 'react';
import { Alert, Box, Button, Divider, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadEnquiryUpdateSchema, type LeadEnquiryUpdateValues } from '../schemas/leadEnquirySchema';
import type { LeadEnquiry } from '../types/leadEnquiry';
import StatusChip from '@/components/common/StatusChip';

interface Props { lead: LeadEnquiry; saving: boolean; error: string; onClose: () => void; onSave: (values: LeadEnquiryUpdateValues) => void; }
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export default function LeadEnquiryDetailsForm({ lead, saving, error, onClose, onSave }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<LeadEnquiryUpdateValues>({
    resolver: zodResolver(leadEnquiryUpdateSchema), defaultValues: { status: lead.status, internalNote: lead.internalNote },
  });
  useEffect(() => reset({ status: lead.status, internalNote: lead.internalNote }), [lead, reset]);
  return <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>{lead.id}</Typography><Stack direction="row" spacing={1} alignItems="center"><StatusChip status={lead.status} /><IconButton aria-label="Close details" onClick={onClose} size="small"><CloseOutlinedIcon /></IconButton></Stack></Stack>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {([['Customer',lead.customer],['Product type',lead.product],['Loan amount',money(lead.amount)],['Tenure',`${lead.tenureMonths} months`],['Branch',lead.branch],['Monthly income',money(lead.monthlyIncome)],['Existing loans',String(lead.existingLoans)],['Eligible amount shown',money(lead.eligibleAmount)]] as string[][]).map(([label,value]) => <Stack key={label} direction="row" justifyContent="space-between" gap={2} sx={{ py: 1.15 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="body2" fontWeight={650} textAlign="right">{value}</Typography></Stack>)}
    <Divider sx={{ my: 1 }} />
    <Box component="form" onSubmit={handleSubmit(onSave)} noValidate>
      <Controller name="status" control={control} render={({ field }) => <TextField {...field} select label="Follow-up status" fullWidth size="small" sx={{ mb: 2 }} disabled={saving}>{[['new','New'],['contacted','Contacted'],['closed','Closed']].map(([value,label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField>} />
      <Controller name="internalNote" control={control} render={({ field }) => <TextField {...field} label="Internal note" placeholder="Visible to bank staff only" multiline minRows={3} fullWidth size="small" disabled={saving} error={!!errors.internalNote} helperText={errors.internalNote?.message ?? 'Internal only · maximum 1,000 characters'} />} />
      <Stack direction="row" spacing={1} mt={2}><Button type="submit" variant="contained" fullWidth disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button><Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>Close</Button></Stack>
    </Box>
  </Paper>;
}
