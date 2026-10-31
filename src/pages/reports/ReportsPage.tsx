import { useMemo, useState } from 'react';
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ReportFiltersForm from './components/ReportFiltersForm';
import { reportsDemo } from './data/reportsDemo';
import type { RecentReport } from './types/report';
import type { ReportFilterValues } from './schemas/reportFilterSchema';

export default function ReportsPage() {
  const [reports, setReports] = useState<RecentReport[]>(reportsDemo);
  const [feedback, setFeedback] = useState('');
  const [format, setFormat] = useState<ReportFilterValues['format']>('xlsx');

  const columns = useMemo<DataTableColumn<RecentReport>[]>(() => [
    { key: 'id', label: 'Report ID', nowrap: true, render: (row) => <Typography fontWeight={700}>{row.id}</Typography> },
    { key: 'report', label: 'Report name' },
    { key: 'branch', label: 'Branch' },
    { key: 'period', label: 'Period', nowrap: true },
    { key: 'generated', label: 'Generated', nowrap: true },
    { key: 'status', label: 'Status', render: (row) => <Chip size="small" label={row.status} color={row.status === 'Ready' ? 'success' : row.status === 'Failed' ? 'error' : 'warning'} variant="outlined" /> },
  ], []);

  const handleGenerate = (values: ReportFilterValues) => {
    const nextReport: RecentReport = {
      id: `RP-${1005 + reports.length - reportsDemo.length}`,
      report: 'Custom Report',
      branch: values.branch,
      period: `${values.fromDate} – ${values.toDate}`,
      generated: new Date().toLocaleString(),
      status: 'Ready',
    };
    setReports((current) => [nextReport, ...current]);
    setFormat(values.format);
    setFeedback(`Report generated successfully in ${values.format.toUpperCase()} format. This demo records the report locally.`);
  };

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Generate reports and review previously generated reports." />
      {feedback && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFeedback('')}>{feedback}</Alert>}
      <ReportFiltersForm report={format} onGenerate={handleGenerate} onReset={() => setFeedback('')} />
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={750}>Recently generated reports</Typography>
          <Typography variant="body2" color="text.secondary">{reports.length} reports</Typography>
        </Stack>
        <DataTable rows={reports} columns={columns} getRowId={(row) => row.id} emptyMessage="No reports have been generated yet." />
      </Paper>
    </Box>
  );
}
