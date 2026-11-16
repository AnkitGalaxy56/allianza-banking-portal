import { useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { getErrorMessage } from '@/services/api/apiError';
import { mobileUtilitiesService, type DeviceLookupResult } from '@/services/mobile-utilities.service';
import { fieldSx, panelSx, Panel, SelectField } from './components/DeviceResetFormFields';
import { deviceLookupSchema } from './schemas/deviceResetSchema';
import type { DeviceResetRecord } from './types/deviceReset';

type Toast = { severity: 'success' | 'warning' | 'error'; message: string } | null;

export default function DeviceResetPage() {
  const [number, setNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [found, setFound] = useState<DeviceLookupResult | null>(null);
  const [reason, setReason] = useState('Lost or stolen phone');
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [history, setHistory] = useState<DeviceResetRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [lookupErrors, setLookupErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const loadHistory = async () => {
    try {
      const result = await mobileUtilitiesService.listDeviceResets({ page: 1, pageSize: 20 });
      setHistory(result.items);
    } catch (e) {
      setToast({ severity: 'error', message: getErrorMessage(e, 'Unable to load recent device resets.') });
    } finally {
      setHistoryLoading(false);
    }
  };
  useEffect(() => { void loadHistory(); }, []);

  const search = async () => {
    const parsed = deviceLookupSchema.safeParse({ customerNumber: number, mobile });
    if (!parsed.success) {
      setLookupErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      setFound(null);
      setToast(null);
      return;
    }
    setLookupErrors({});
    setBusy(true);
    try {
      setFound(await mobileUtilitiesService.lookupDevice({ customerNumber: number.trim(), mobile }));
      setToast({ severity: 'success', message: 'Customer found.' });
    } catch (e) {
      setFound(null);
      setToast({ severity: 'warning', message: getErrorMessage(e, 'No registered customer matches these details.') });
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!found) return;
    setBusy(true);
    try {
      await mobileUtilitiesService.resetDevice({ customerNumber: found.customerNumber, mobile, reason });
      setConfirm(false);
      setFound(null);
      setToast({ severity: 'success', message: `Device reset completed for ${found.customerNumber}. The customer can now sign in on a new phone.` });
      await loadHistory();
    } catch (e) {
      setConfirm(false);
      setToast({ severity: 'error', message: getErrorMessage(e, 'Unable to reset the device.') });
    } finally {
      setBusy(false);
    }
  };

  return <Box>
    <PageHeader title="Device Reset" subtitle="Unbind a customer’s registered phone so they can sign in on a new device" />
    {toast && <Alert severity={toast.severity} onClose={() => setToast(null)} sx={{ mb: 2 }}>{toast.message}</Alert>}
    <Grid container spacing={2.5} alignItems="flex-start">
      <Grid item xs={12} md={4}>
        <Stack spacing={2.5}>
          <Paper sx={{ ...panelSx, p: 2.5 }}>
            <Typography variant="h6" fontWeight={750} mb={2}>Find customer</Typography>
            <Stack spacing={2}>
              <TextField label="Customer number" placeholder="Enter customer number" value={number} onChange={(e) => setNumber(e.target.value)} error={!!lookupErrors.customerNumber} helperText={lookupErrors.customerNumber} fullWidth sx={fieldSx} />
              <TextField label="Registered mobile number" placeholder="10-digit number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} error={!!lookupErrors.mobile} helperText={lookupErrors.mobile} inputProps={{ maxLength: 10, inputMode: 'numeric' }} fullWidth sx={fieldSx} />
              <Button variant="contained" onClick={() => void search()} disabled={busy}>{busy && !confirm ? 'Searching…' : 'Search'}</Button>
            </Stack>
          </Paper>
          {found && <Paper sx={{ ...panelSx, p: 2.5 }}>
            <Typography variant="h6" fontWeight={750} mb={2}>Customer found</Typography>
            {[['Customer number', found.customerNumber], ['Branch', found.branch], ['Registered mobile', found.mobile], ['Current device', found.device], ['Registered on', found.registeredOn]].map(([k, v]) =>
              <Stack key={k} direction="row" justifyContent="space-between" gap={1} sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">{k}</Typography>
                <Typography variant="body2" fontWeight={650}>{v}</Typography>
              </Stack>)}
            <Box mt={2}><SelectField label="Reason for reset" value={reason} onChange={setReason} options={['Lost or stolen phone', 'Changed phone', 'App not working', 'Other']} /></Box>
            <Stack direction="row" spacing={1} mt={2}>
              <Button color="error" variant="contained" onClick={() => setConfirm(true)} startIcon={<RestartAltRoundedIcon />} disabled={found.device === 'No device registered'}>Reset device</Button>
              <Button variant="outlined" color="inherit" onClick={() => setFound(null)}>Cancel</Button>
            </Stack>
            {found.device === 'No device registered' && <Typography variant="caption" color="warning.main" display="block" mt={1.5}>No phone is currently registered, so there is nothing to reset.</Typography>}
            <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>After a reset the customer must verify again on the new device. This action is recorded in the audit log.</Typography>
          </Paper>}
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        <Panel title="Recent device resets">
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow>{['CUSTOMER', 'BRANCH', 'REASON', 'BY', 'DATE', 'STATUS'].map((x) => <TableCell key={x} sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary' }}>{x}</TableCell>)}</TableRow></TableHead>
              <TableBody>
                {history.map((x, i) => <TableRow key={x.customer + i}>
                  <TableCell sx={{ fontWeight: 700 }}>{x.customer}</TableCell>
                  <TableCell>{x.branch}</TableCell>
                  <TableCell>{x.reason}</TableCell>
                  <TableCell>{x.by}</TableCell>
                  <TableCell>{x.date}</TableCell>
                  <TableCell><StatusChip status={x.status} /></TableCell>
                </TableRow>)}
                {!history.length && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>{historyLoading ? 'Loading…' : 'No device resets yet.'}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
      </Grid>
    </Grid>
    <ConfirmDialog open={confirm} title="Reset customer device?" message={`This will unbind the registered device for ${found?.customerNumber ?? ''}. The customer will need to verify again on the new device. This action will be recorded in the audit log.`} variant="danger" confirmText="Reset device" onCancel={() => setConfirm(false)} onConfirm={() => void reset()} />
  </Box>;
}
