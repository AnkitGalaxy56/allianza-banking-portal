import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { reportFilterSchema, type ReportFilterValues } from '../schemas/reportFilterSchema';

const branches = ['All branches', 'Main branch', 'Branch 2', 'Branch 4', 'Branch 7'];
const statuses = ['All status', 'Active', 'Inactive', 'Completed', 'Pending'];
interface Props { report: ReportFilterValues['format']; onGenerate: (values: ReportFilterValues) => void; onReset: () => void; }
export default function ReportFiltersForm({ report, onGenerate, onReset }: Props) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ReportFilterValues>({
    resolver: zodResolver(reportFilterSchema),
    defaultValues: { branch: 'All branches', fromDate: '2026-09-01', toDate: '2026-09-30', status: 'All status', format: report },
  });
  return <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
    <Typography variant="h6" fontWeight={750} mb={2}>{'Report filters'}</Typography>
    <Box component="form" noValidate onSubmit={handleSubmit(onGenerate)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}><Controller name="branch" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Branch" error={!!errors.branch} helperText={errors.branch?.message}>{branches.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><TextField {...register('fromDate')} type="date" fullWidth label="From date" InputLabelProps={{ shrink: true }} error={!!errors.fromDate} helperText={errors.fromDate?.message} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><TextField {...register('toDate')} type="date" fullWidth label="To date" InputLabelProps={{ shrink: true }} error={!!errors.toDate} helperText={errors.toDate?.message} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><Controller name="status" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Status" error={!!errors.status} helperText={errors.status?.message}>{statuses.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><Controller name="format" control={control} render={({ field }) => <TextField {...field} select fullWidth label="Format">{[{value:'xlsx',label:'Excel (.xlsx)'},{value:'csv',label:'CSV (.csv)'}].map(v => <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>)}</TextField>} /></Grid>
        <Grid item xs={12}><Stack direction="row" spacing={1.25}><Button type="submit" variant="contained">Generate report</Button><Button variant="outlined" onClick={() => { reset({ branch:'All branches', fromDate:'2026-09-01', toDate:'2026-09-30', status:'All status', format:report }); onReset(); }}>Reset filters</Button></Stack></Grid>
      </Grid>
    </Box>
  </Paper>;
}
