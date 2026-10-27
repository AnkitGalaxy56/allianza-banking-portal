import { useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ReportFiltersForm from './components/ReportFiltersForm';
import { reportsDemo } from './data/reportsDemo';
import type { RecentReport, ReportKind } from './types/report';
import type { ReportFilterValues } from './schemas/reportFilterSchema';

const reportOptions: { title: ReportKind; description: string; icon: typeof PeopleAltOutlinedIcon }[] = [
  { title: 'Application Users Report', description: 'Registered customers, devices and login status by branch.', icon: PeopleAltOutlinedIcon },
  { title: 'Requests Report', description: 'Service requests by type, status and turnaround time.', icon: DescriptionOutlinedIcon },
  { title: 'Transaction Report', description: 'Activity summary from the bank systems the app is connected to.', icon: BarChartOutlinedIcon },
];
export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportKind>('Application Users Report');
  const [format, setFormat] = useState<ReportFilterValues['format']>('xlsx');
  const [pending, setPending] = useState<ReportFilterValues | null>(null);
  const [rows, setRows] = useState(reportsDemo);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generate = async () => {
    if (!pending) return;
    setBusy(true); setError('');
    try {
      const period = `${new Date(pending.fromDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })} – ${new Date(pending.toDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}`;
      const report: RecentReport = { id: `RP-${Date.now()}`, report: selected, branch: pending.branch, period, generated: new Date().toLocaleString(), status: 'Ready' };
      setRows(old => [report, ...old]);
      const csv = [['Report','Branch','Period','Status'], [report.report, report.branch, report.period, report.status]].map(line => line.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `${selected.toLowerCase().replaceAll(' ', '-')}.${pending.format === 'csv' ? 'csv' : 'csv'}`; link.click(); URL.revokeObjectURL(url);
      setFormat(pending.format);
      setFeedback(`${selected} generated in demo mode. A CSV sample was downloaded.`);
      setPending(null);
    } catch {
      setError('Unable to generate the report. Please try again.');
    } finally { setBusy(false); }
  };
  return <Box>
    <PageHeader title="Reports" subtitle="Generate and download reports for your bank" />
    <Grid container spacing={2} sx={{ mb: 2.5 }}>{reportOptions.map(option => { const Icon = option.icon; const active = selected === option.title; return <Grid item xs={12} md={4} key={option.title}><Paper onClick={() => setSelected(option.title)} variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 3, cursor: 'pointer', borderColor: active ? 'primary.main' : 'divider', borderWidth: active ? 2 : 1, bgcolor: active ? 'action.selected' : 'background.paper' }}><Box sx={{ width: 42, height: 42, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'action.selected', color: 'primary.main', mb: 1.5 }}><Icon /></Box><Typography fontWeight={750}>{option.title}</Typography><Typography variant="body2" color="text.secondary" mt={1}>{option.description}</Typography></Paper></Grid>; })}</Grid>
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
    <ReportFiltersForm report={format} onGenerate={values => setPending(values)} onReset={() => setError('')} />
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mt: 2.5 }}>
      <Box sx={{ p: 2.5 }}><Typography variant="h6" fontWeight={750}>Recent reports</Typography></Box>
      <TableContainer><Table size="small"><TableHead><TableRow>{['Report','Branch','Period','Generated','Status',''].map((h,i) => <TableCell key={`${h}-${i}`} sx={{ bgcolor: 'grey.50', color: 'text.secondary', fontSize: 11, fontWeight: 800 }}>{h}</TableCell>)}</TableRow></TableHead><TableBody>{rows.map(row => <TableRow key={row.id}><TableCell sx={{ fontWeight: 650 }}>{row.report}</TableCell><TableCell>{row.branch}</TableCell><TableCell>{row.period}</TableCell><TableCell>{row.generated}</TableCell><TableCell><Typography color="success.main" fontWeight={700} variant="body2">{row.status}</Typography></TableCell><TableCell><Button size="small" onClick={() => { setFeedback(`Report “${row.report}” is available in demo mode.`); }}>Download</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>
    </Paper>
    <ConfirmDialog open={!!pending} title="Generate report?" message={`Generate ${selected} for ${pending?.branch ?? 'the selected branch'} from ${pending?.fromDate ?? ''} to ${pending?.toDate ?? ''}?`} confirmText="Generate report" variant="warning" loading={busy} onCancel={() => setPending(null)} onConfirm={generate} />
  </Box>;
}
