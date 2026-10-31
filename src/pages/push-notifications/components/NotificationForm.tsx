import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { pushNotificationSchema, type PushNotificationFormValues } from '../schemas/pushNotificationSchema';

const branches = ['All branches', 'Main branch', 'Branch 2', 'Branch 4', 'Branch 7'];
const audiences = ['All customers', 'Customers with pending MPIN', 'Customers with active loans'];
interface Props {
  onSubmit: (values: PushNotificationFormValues, action: 'send' | 'draft') => void;
  initialValues?: Partial<PushNotificationFormValues>;
  compact?: boolean;
  submitLabel?: string;
  formId?: string;
}
export default function NotificationForm({ onSubmit, initialValues, compact = false, submitLabel = 'Send notification', formId }: Props) {
  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<PushNotificationFormValues>({
    resolver: zodResolver(pushNotificationSchema),
    defaultValues: { branch: 'All branches', audience: 'All customers', title: '', message: '', schedule: 'now', dateTime: '', ...initialValues },
  });
  useEffect(() => { reset({ branch: 'All branches', audience: 'All customers', title: '', message: '', schedule: 'now', dateTime: '', ...initialValues }); }, [initialValues, reset]);
  const title = watch('title');
  const message = watch('message');
  const schedule = watch('schedule');
  return <Grid container spacing={2.5} alignItems="flex-start">
    <Grid item xs={12} lg={compact ? 12 : 8}>
      <Paper variant="outlined" sx={{ borderRadius: 3, p: compact ? 0 : 2.5, border: compact ? 0 : undefined, boxShadow: 'none' }}>
        {!compact && <Typography variant="h6" fontWeight={750} mb={2}>New notification</Typography>}
        <Box component="form" id={formId} onSubmit={handleSubmit(values => onSubmit(values, 'send'))} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Controller name="branch" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Branch" error={!!errors.branch} helperText={errors.branch?.message}>{branches.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="audience" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Audience" error={!!errors.audience} helperText={errors.audience?.message}>{audiences.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>} /></Grid>
            <Grid item xs={12}><TextField {...register('title')} fullWidth label="Title" placeholder="Notification title" error={!!errors.title} helperText={errors.title?.message} /></Grid>
            <Grid item xs={12}><TextField {...register('message')} fullWidth multiline minRows={4} label="Message" placeholder="Write the message customers will see" error={!!errors.message} helperText={errors.message?.message} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="schedule" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Schedule">{[{value:'now',label:'Send now'},{value:'scheduled',label:'Schedule for later'}].map(v => <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>)}</TextField>} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register('dateTime')} type="datetime-local" fullWidth label="Date and time" InputLabelProps={{ shrink: true }} disabled={schedule !== 'scheduled'} error={!!errors.dateTime} helperText={errors.dateTime?.message} inputProps={{ min: new Date().toISOString().slice(0,16) }} /></Grid>
            <Grid item xs={12}>{!compact && <Stack direction="row" spacing={1.25} flexWrap="wrap"><Button variant="contained" type="submit">{submitLabel}</Button><Button variant="outlined" onClick={handleSubmit(values => onSubmit(values, 'draft'))}>Save as draft</Button></Stack>}</Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
    {!compact && <Grid item xs={12} lg={4}>
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
        <Typography fontWeight={750} mb={2}>Preview</Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 3 }}>
          <Paper elevation={1} sx={{ borderRadius: 2.5, p: 1.75, display: 'flex', gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', flexShrink: 0 }}>⌂</Box>
            <Box><Typography fontWeight={750} variant="body2">{title || 'Notification title'}</Typography><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message || 'Your message appears here exactly as customers will see it.'}</Typography></Box>
          </Paper>
        </Box>
      </Paper>
    </Grid>}
  </Grid>;
}
