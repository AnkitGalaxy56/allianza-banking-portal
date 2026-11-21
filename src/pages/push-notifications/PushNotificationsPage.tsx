import { useEffect, useState } from 'react';
import { Alert, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import FormDialog from '@/components/form/FormDialog';
import NotificationForm from './components/NotificationForm';
import { getErrorMessage } from '@/services/api/apiError';
import { mobileUtilitiesService } from '@/services/mobile-utilities.service';
import type { PushNotification } from './types/pushNotification';
import type { PushNotificationFormValues } from './schemas/pushNotificationSchema';
import { headerNotificationService, type HeaderNotification } from '@/services/notifications-header.service';

type PendingAction = { values: PushNotificationFormValues; action: 'send' | 'draft' } | null;

export default function PushNotificationsPage() {
  const [rows, setRows] = useState<PushNotification[]>([]);
  const [inboxRows, setInboxRows] = useState<HeaderNotification[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadRows = async () => {
    try {
      const result = await mobileUtilitiesService.listNotifications({ page: 1, pageSize: 200 });
      setRows(result.items);
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to load notifications.'));
    } finally {
      setLoading(false);
    }
  };
  const loadInboxRows = async () => {
    try { setInboxRows(await headerNotificationService.list()); }
    catch (e) { setError(getErrorMessage(e, 'Unable to load customer notification records.')); }
    finally { setInboxLoading(false); }
  };
  useEffect(() => { void loadRows(); void loadInboxRows(); }, []);
  const [pending, setPending] = useState<PendingAction>(null);
  const [editing, setEditing] = useState<PushNotification | null>(null);
  const [viewing, setViewing] = useState<PushNotification | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const confirmAction = async () => {
    if (!pending) return;
    setSaving(true); setError('');
    try {
      const isDraft = pending.action === 'draft';
      const saved = await mobileUtilitiesService.createNotification({
        title: pending.values.title.trim(),
        branch: pending.values.branch,
        audience: pending.values.audience,
        message: pending.values.message.trim(),
        action: pending.action,
        schedule: pending.values.schedule,
        dateTime: pending.values.dateTime,
      });
      await loadRows();
      setFeedback(isDraft ? 'Notification saved as draft.' : saved.status === 'Scheduled' ? 'Notification scheduled.' : `Notification sent to ${saved.recipients ?? 0} customers.`);
      setPending(null);
    } catch (e) {
      setPending(null);
      setError(getErrorMessage(e, 'Unable to save this notification. Please try again.'));
    } finally { setSaving(false); }
  };

  const sendNow = async (row: PushNotification) => {
    setError('');
    try {
      const sent = await mobileUtilitiesService.sendNotification(row.id);
      await loadRows();
      setFeedback(`“${row.title}” sent to ${sent.recipients ?? 0} customers.`);
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to send this notification.'));
    }
  };

  const updateNotification = async (values: PushNotificationFormValues) => {
    if (!editing) return;
    try {
      await mobileUtilitiesService.updateNotification(editing.id, {
        title: values.title.trim(),
        branch: values.branch,
        audience: values.audience,
        message: values.message.trim(),
      });
      await loadRows();
      setEditing(null);
      setFeedback('Notification updated successfully.');
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to update this notification.'));
    }
  };

  const columns: DataTableColumn<PushNotification>[] = [
    { key: 'title', label: 'Title', minWidth: 210, render: row => <Typography fontWeight={650}>{row.title}</Typography> },
    { key: 'branch', label: 'Branch', minWidth: 130, render: row => row.branch },
    { key: 'audience', label: 'Audience', minWidth: 190, render: row => row.audience },
    { key: 'sentOn', label: 'Sent on', minWidth: 145, render: row => row.sentOn },
    { key: 'status', label: 'Status', minWidth: 110, render: row => <StatusChip status={row.status.toLowerCase()} /> },
    { key: 'actions', label: 'Actions', minWidth: 130, nowrap: true, render: row => (
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" aria-label={`View ${row.title}`} title="View notification" onClick={() => setViewing(row)}><VisibilityOutlinedIcon fontSize="small" /></IconButton>
        {!['sent', 'send'].includes(row.status.trim().toLowerCase()) && <IconButton size="small" aria-label={`Send ${row.title} now`} title="Send now" onClick={() => void sendNow(row)}><SendOutlinedIcon fontSize="small" /></IconButton>}
        {!['sent', 'send'].includes(row.status.trim().toLowerCase()) && <IconButton size="small" aria-label={`Edit ${row.title}`} title="Edit notification" onClick={() => setEditing(row)}><EditOutlinedIcon fontSize="small" /></IconButton>}
      </Stack>
    ) },
  ];

  const inboxColumns: DataTableColumn<HeaderNotification>[] = [
    { key: 'title', label: 'Title', minWidth: 220, render: row => <Typography fontWeight={650}>{row.title}</Typography> },
    { key: 'customer_id', label: 'Customer ID', minWidth: 140, render: row => row.customer_id ?? '—' },
    { key: 'category', label: 'Category', minWidth: 140, render: row => row.category ?? '—' },
    { key: 'message', label: 'Message', minWidth: 280, render: row => row.message },
    { key: 'created_at', label: 'Created on', minWidth: 180, render: row => row.created_at ? new Date(row.created_at).toLocaleString() : '—' },
    { key: 'is_read', label: 'Read status', minWidth: 110, render: row => <StatusChip status={row.is_read ? 'read' : 'unread'} /> },
    { key: 'priority', label: 'Priority', minWidth: 100, render: row => row.priority ?? '—' },
    { key: 'service_type', label: 'Service', minWidth: 160, render: row => row.service_type ?? '—' },
    { key: 'reference_id', label: 'Reference', minWidth: 110, render: row => row.reference_id ?? '—' },
  ];

  const editInitialValues: Partial<PushNotificationFormValues> | undefined = editing ? {
    title: editing.title,
    branch: editing.branch,
    audience: editing.audience,
    message: editing.message,
    schedule: 'now',
    dateTime: '',
  } : undefined;

  return <Box>
    <PageHeader title="Push Notifications" subtitle="Send messages to your bank’s customers on the mobile app" />
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
    <NotificationForm onSubmit={(values, action) => { setPending({ values, action }); setError(''); }} />
    <Box sx={{ mt: 2.5, border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Typography variant="h6" fontWeight={750}>Customer notification records</Typography>
        <Typography variant="body2" color="text.secondary">Records from MB012001. Super Admin sees all records; bank users see records for their bank.</Typography>
      </Box>
      <DataTable rows={inboxRows} columns={inboxColumns} getRowId={row => row.id} emptyMessage={inboxLoading ? 'Loading notification records…' : 'No notification records found.'} />
    </Box>
    <Box sx={{ mt: 2.5, border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Typography variant="h6" fontWeight={750}>Sent notifications (campaigns)</Typography>
      </Box>
      <DataTable rows={rows} columns={columns} getRowId={row => row.id} emptyMessage={loading ? 'Loading notifications…' : 'No notifications found.'} />
    </Box>

    <FormDialog open={!!editing} title="Edit notification" description="Update the notification details." onClose={() => setEditing(null)} maxWidth="sm"
      actions={<><Button onClick={() => setEditing(null)} color="inherit">Cancel</Button><Button variant="contained" form="notification-edit-form" type="submit">Save changes</Button></>}>
      {editing && <NotificationForm compact formId="notification-edit-form" submitLabel="Save changes" initialValues={editInitialValues}
        onSubmit={values => void updateNotification(values)} />}
    </FormDialog>

    <FormDialog open={!!viewing} title="Notification details" description="Review the notification content and delivery information." onClose={() => setViewing(null)} maxWidth="sm"
      actions={<Button variant="contained" onClick={() => setViewing(null)}>Close</Button>}>
      {viewing && <Stack spacing={2}>
        <Box><Typography variant="caption" color="text.secondary">Title</Typography><Typography fontWeight={700}>{viewing.title}</Typography></Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box flex={1}><Typography variant="caption" color="text.secondary">Branch</Typography><Typography>{viewing.branch}</Typography></Box>
          <Box flex={1}><Typography variant="caption" color="text.secondary">Audience</Typography><Typography>{viewing.audience}</Typography></Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center"><Typography variant="caption" color="text.secondary">Status</Typography><StatusChip status={viewing.status.toLowerCase()} /></Stack>
        <Box><Typography variant="caption" color="text.secondary">Sent on</Typography><Typography>{viewing.sentOn}</Typography></Box>
        <Box><Typography variant="caption" color="text.secondary">Message</Typography><Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewing.message}</Typography></Box>
      </Stack>}
    </FormDialog>

    <ConfirmDialog open={!!pending} title={pending?.action === 'draft' ? 'Save notification draft?' : pending?.values.schedule === 'scheduled' ? 'Schedule notification?' : 'Send notification?'} message={pending?.action === 'draft' ? 'Save this notification as a draft?' : pending?.values.schedule === 'scheduled' ? `Schedule “${pending?.values.title}” for the selected date and time?` : `Confirm sending “${pending?.values.title}” to ${pending?.values.audience.toLowerCase()} in ${pending?.values.branch.toLowerCase()}?`} confirmText={pending?.action === 'draft' ? 'Save draft' : pending?.values.schedule === 'scheduled' ? 'Schedule' : 'Confirm send'} variant="warning" loading={saving} onCancel={() => setPending(null)} onConfirm={confirmAction} />
  </Box>;
}
