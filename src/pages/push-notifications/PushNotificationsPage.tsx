import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import NotificationForm from './components/NotificationForm';
import { pushNotificationsDemo } from './data/pushNotificationsDemo';
import type { PushNotification } from './types/pushNotification';
import type { PushNotificationFormValues } from './schemas/pushNotificationSchema';

type PendingAction = { values: PushNotificationFormValues; action: 'send' | 'draft' } | null;
export default function PushNotificationsPage() {
  const [rows, setRows] = useState(pushNotificationsDemo);
  const [pending, setPending] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const confirmAction = async () => {
    if (!pending) return;
    setSaving(true); setError('');
    try {
      const isDraft = pending.action === 'draft';
      const row: PushNotification = {
        id: `PN-${Date.now()}`,
        title: pending.values.title.trim(),
        branch: pending.values.branch,
        audience: pending.values.audience,
        sentOn: isDraft ? '—' : pending.values.schedule === 'scheduled' ? new Date(pending.values.dateTime ?? '').toLocaleString() : new Date().toLocaleString(),
        status: isDraft ? 'Draft' : pending.values.schedule === 'scheduled' ? 'Scheduled' : 'Sent',
        message: pending.values.message.trim(),
      };
      setRows(old => [row, ...old]);
      setFeedback(isDraft ? 'Notification saved as draft.' : row.status === 'Scheduled' ? 'Notification scheduled.' : 'Notification queued in demo mode.');
      setPending(null);
    } catch {
      setError('Unable to save this notification. Please try again.');
    } finally { setSaving(false); }
  };
  return <Box>
    <PageHeader title="Push Notifications" subtitle="Send messages to your bank’s customers on the mobile app" />
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
    <NotificationForm onSubmit={(values, action) => { setPending({ values, action }); setError(''); }} />
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mt: 2.5 }}>
      <Box sx={{ p: 2.5 }}><Typography variant="h6" fontWeight={750}>Sent notifications</Typography></Box>
      <TableContainer><Table size="small"><TableHead><TableRow>{['Title','Branch','Audience','Sent on','Status'].map(h => <TableCell key={h} sx={{ bgcolor: 'grey.50', color: 'text.secondary', fontSize: 11, fontWeight: 800 }}>{h}</TableCell>)}</TableRow></TableHead><TableBody>{rows.map(row => <TableRow key={row.id}><TableCell sx={{ fontWeight: 650 }}>{row.title}</TableCell><TableCell>{row.branch}</TableCell><TableCell>{row.audience}</TableCell><TableCell>{row.sentOn}</TableCell><TableCell><StatusChip status={row.status.toLowerCase()} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>
    </Paper>
    <ConfirmDialog open={!!pending} title={pending?.action === 'draft' ? 'Save notification draft?' : pending?.values.schedule === 'scheduled' ? 'Schedule notification?' : 'Send notification?'} message={pending?.action === 'draft' ? 'Save this notification as a draft?' : pending?.values.schedule === 'scheduled' ? `Schedule “${pending?.values.title}” for the selected date and time?` : `Confirm sending “${pending?.values.title}” to ${pending?.values.audience.toLowerCase()} in ${pending?.values.branch.toLowerCase()}?`} confirmText={pending?.action === 'draft' ? 'Save draft' : pending?.values.schedule === 'scheduled' ? 'Schedule' : 'Confirm send'} variant="warning" loading={saving} onCancel={() => setPending(null)} onConfirm={confirmAction} />
  </Box>;
}
