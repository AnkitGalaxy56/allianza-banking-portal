import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import type { RequestModuleConfig, RequestRecord, RequestStatus } from './types';
import { validateRequestForm } from './schema';
import { getErrorMessage } from '@/services/api/apiError';
import type { RequestHandlingModule } from '@/services/request-handling.service';
import { serverFieldErrors, useRequestModule } from './useRequestModule';

export default function RequestHandlingPage({ config, module }: { config: RequestModuleConfig; module: RequestHandlingModule }) {
    const store = useRequestModule(module);
    const records: RequestRecord[] = store.records;
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<'view' | 'pending'>('view');
    const [selected, setSelected] = useState<RequestRecord | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editing, setEditing] = useState<RequestRecord | null>(null);
    const [fields, setFields] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const filtered = useMemo(() => records.filter((r) => `${r.id} ${r.status} ${r.submittedOn} ${Object.values(r.fields).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (tab === 'view' || r.status === 'Pending')), [records, search, tab]);
    const startCreate = () => { setEditing(null); setFields(Object.fromEntries(config.detailFields.map((f) => [f.key, '']))); setFieldErrors({}); setFeedback(''); setFormOpen(true); };
    const openDetail = async (r: RequestRecord) => { try { setSelected(await store.getOne(r.id)); } catch (e) { setFeedback(`Please retry: ${getErrorMessage(e, 'Unable to load the request.')}`); } };
    // Edit is intentionally disabled for non-Payment Request Handling modules.
    // const startEdit = async (r: RequestRecord) => { ...existing edit implementation intentionally disabled... };
    const save = () => { const required = config.requiredKeys ?? config.detailFields.slice(0, 2).map((f) => f.key); const errors = validateRequestForm(fields, required); setFieldErrors(errors); if (Object.keys(errors).length) { setFeedback('Please correct the highlighted fields before submitting.'); return; } setFeedback(''); setConfirmOpen(true); };
    const commit = async () => { try { if (editing) { await store.update(editing.id, fields); setFeedback('Request updated and sent for authorisation.'); } else { await store.create(fields); setFeedback('Request created and sent for authorisation.'); } setConfirmOpen(false); setFormOpen(false); } catch (e) { setConfirmOpen(false); setFieldErrors(serverFieldErrors(e)); setFeedback(`Please correct the highlighted fields before submitting. ${getErrorMessage(e, '')}`); } };
    const decide = async (status: RequestStatus) => { if (!selected) return; const label = selected.displayId ?? selected.id; try { await store.decide(selected.id, status); setFeedback(`${label} ${status === 'Authorised' ? 'verified' : 'rejected'} successfully.`); } catch (e) { setFeedback(`Please review: ${getErrorMessage(e, 'Unable to update the request.')}`); } setSelected(null); };
    const columns: DataTableColumn<RequestRecord>[] = [
        { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (r) => <Typography fontWeight={700} fontSize={13}>{r.displayId ?? r.id}</Typography> },
        ...config.columns.map((column) => ({ key: column.key, label: column.label, minWidth: 25, render: (r: RequestRecord) => r.fields[column.key] || '—' })),
        { key: 'status', label: 'Status', minWidth: 25, nowrap: true, render: (r) => <Chip size="small" variant="outlined" color={r.status === 'Pending' ? 'warning' : r.status === 'Authorised' ? 'success' : 'error'} label={r.status === 'Pending' ? 'Pending for Authorisation' : r.status} /> },
        { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (r) => r.status === 'Pending' ? <Button size="small" color="success" variant="contained" disabled={r.canVerify === false} title={r.canVerify === false ? 'Maker-checker: another user must verify this request' : undefined} onClick={() => void openDetail(r)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={r.status !== 'Authorised'} onClick={() => void openDetail(r)}>View</Button>{/* Edit intentionally disabled for non-Payment modules. */}</Stack> },
    ];
    return <Box>
        <PageHeader title={config.title} subtitle={config.description} />
        {store.error && <Alert sx={{ mb: 2 }} severity="error">{store.error}</Alert>}
        {feedback && <Alert sx={{ mb: 2 }} severity={feedback.startsWith('Please') ? 'warning' : 'success'} onClose={() => setFeedback('')}>{feedback}</Alert>}
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
            <Box sx={{ p: 2.5 }}>
                <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
                    <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
                    <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending for Authorisation ({records.filter((r) => r.status === 'Pending').length})</Button>
                    <Box sx={{ flex: 1 }} />
                    {!config.hideCreateButton && <Button size="small" variant="contained" onClick={startCreate}>Create</Button>}
                </Stack>
            </Box>
            <DataTable rows={filtered} columns={columns} getRowId={(r) => r.id} emptyMessage={store.loading ? 'Loading requests…' : 'No requests found.'} />
            <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography><Typography variant="body2" color="text.secondary">Pending: {records.filter((r) => r.status === 'Pending').length}</Typography></Stack>
        </Paper>
        <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="lg">
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>{selected?.status === 'Pending' ? 'Verify Request' : 'View Request'} — {selected?.displayId ?? selected?.id}</DialogTitle>
            <DialogContent dividers sx={{ p: 2 }}>
                {selected && (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Payment Request Details</Typography>
                            <Stack direction="row" spacing={1}>
                                <Chip size="small" variant="outlined" label={selected.fields.accountStatus || '—'} />
                                <Chip size="small" label={selected.status === 'Pending' ? 'Pending for Authorisation' : selected.status} color={selected.status === 'Pending' ? 'warning' : selected.status === 'Authorised' ? 'success' : 'error'} />
                            </Stack>
                        </Box>
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                            <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover' }}><Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Account Details</Typography></Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, p: 1.25 }}>
                                {config.detailFields.slice(0, 5).map((f) => <Box key={f.key} sx={{ p: 1 }}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography variant="body2" sx={{ fontWeight: 600, mt: .25, overflowWrap: 'anywhere' }}>{selected.fields[f.key] || '—'}</Typography></Box>)}
                            </Box>
                        </Box>
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover' }}><Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Beneficiary Details</Typography></Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, p: 1.25 }}>
                                {config.detailFields.slice(5).map((f) => <Box key={f.key} sx={{ p: 1 }}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography variant="body2" sx={{ fontWeight: 600, mt: .25, overflowWrap: 'anywhere' }}>{selected.fields[f.key] || '—'}</Typography></Box>)}
                            </Box>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 2, py: 1.5 }}><Button size="small" onClick={() => setSelected(null)}>Close</Button>{selected?.status === 'Pending' && selected.canVerify !== false && <><Button size="small" color="error" variant="outlined" onClick={() => decide('Rejected')}>Reject</Button><Button size="small" color="success" variant="contained" onClick={() => decide('Authorised')}>Verify</Button></>}</DialogActions>
        </Dialog>
        {/* <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="lg" PaperProps={{ sx: { width: '100%', maxWidth: 1100, minHeight: { xs: 'auto', md: 520 } } }}> */}
        <Dialog
            open={formOpen}
            onClose={() => setFormOpen(false)}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 1000,
                    maxHeight: '88vh',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 800 }}>{config.title.includes('RTGS / NEFT / IMPS') ? (editing ? 'Edit Payment Request' : 'Create Payment Request') : `${editing ? 'Edit' : 'Create'} ${config.title.replace(/ Requests?$/, '')} Request`}</DialogTitle>
            {/* <DialogContent dividers><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2, pt: 1 }}>{config.detailFields.map((f, index) => <TextField key={f.key} select={Boolean(f.options)} size="small" label={f.label} required={config.requiredKeys ? config.requiredKeys.includes(f.key) : index < 2} disabled={Boolean(config.readOnlyKeys?.includes(f.key)) || (Boolean(editing) && Boolean(config.lockedOnEdit?.includes(f.key)))} error={Boolean(fieldErrors[f.key])} helperText={fieldErrors[f.key] || (config.readOnlyKeys?.includes(f.key) ? 'Set by the system' : ' ')} value={fields[f.key] ?? ''} onChange={(e) => { setFields((old) => ({ ...old, [f.key]: e.target.value })); setFieldErrors((old) => ({ ...old, [f.key]: '' })); }} multiline={['remarks', 'reason'].includes(f.key)} minRows={['remarks', 'reason'].includes(f.key) ? 2 : 1}>{f.options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</TextField>)}</Box></DialogContent> */}


            <DialogContent
                dividers
                sx={{
                    p: 2,
                    overflowY: 'auto',
                }}
            >
                {config.title.includes('RTGS / NEFT / IMPS') ? (
                    <>
                        {/* ACCOUNT DETAILS */}
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: '#234f45',
                                mb: 1,
                            }}
                        >
                            Account Details
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                gap: 1.2,
                                mb: 2,
                            }}
                        >
                            {config.detailFields.slice(0, 5).map((f, index) => (
                                <TextField
                                    key={f.key}
                                    fullWidth
                                    select={Boolean(f.options)}
                                    size="small"
                                    label={f.label}
                                    required={
                                        config.requiredKeys
                                            ? config.requiredKeys.includes(f.key)
                                            : index < 2
                                    }
                                    disabled={
                                        Boolean(config.readOnlyKeys?.includes(f.key)) ||
                                        (Boolean(editing) &&
                                            Boolean(config.lockedOnEdit?.includes(f.key)))
                                    }
                                    error={Boolean(fieldErrors[f.key])}
                                    helperText={
                                        fieldErrors[f.key] ||
                                        (config.readOnlyKeys?.includes(f.key)
                                            ? 'Set by the system'
                                            : undefined)
                                    }
                                    value={fields[f.key] ?? ''}
                                    onChange={(e) => {
                                        setFields((old) => ({
                                            ...old,
                                            [f.key]: e.target.value,
                                        }));

                                        setFieldErrors((old) => ({
                                            ...old,
                                            [f.key]: '',
                                        }));
                                    }}
                                >
                                    {f.options?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ))}
                        </Box>

                        {/* BENEFICIARY DETAILS */}
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: '#234f45',
                                mb: 1,
                            }}
                        >
                            Beneficiary Details
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                gap: 1.2,
                            }}
                        >
                            {config.detailFields.slice(5).map((f) => (
                                <TextField
                                    key={f.key}
                                    fullWidth
                                    select={Boolean(f.options)}
                                    size="small"
                                    label={f.label}
                                    required={
                                        config.requiredKeys
                                            ? config.requiredKeys.includes(f.key)
                                            : false
                                    }
                                    disabled={
                                        Boolean(config.readOnlyKeys?.includes(f.key)) ||
                                        (Boolean(editing) &&
                                            Boolean(config.lockedOnEdit?.includes(f.key)))
                                    }
                                    error={Boolean(fieldErrors[f.key])}
                                    helperText={
                                        fieldErrors[f.key] ||
                                        (config.readOnlyKeys?.includes(f.key)
                                            ? 'Set by the system'
                                            : undefined)
                                    }
                                    value={fields[f.key] ?? ''}
                                    onChange={(e) => {
                                        setFields((old) => ({
                                            ...old,
                                            [f.key]: e.target.value,
                                        }));

                                        setFieldErrors((old) => ({
                                            ...old,
                                            [f.key]: '',
                                        }));
                                    }}
                                    multiline={f.key === 'remarks'}
                                    minRows={f.key === 'remarks' ? 1 : undefined}
                                >
                                    {f.options?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ))}
                        </Box>
                    </>
                ) : (
                    /* KEEP YOUR EXISTING NON-PAYMENT LAYOUT */
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))',
                                lg: 'repeat(3, minmax(0, 1fr))',
                            },
                            gap: 2,
                            pt: 1,
                        }}
                    >
                        {config.detailFields.map((f, index) => (
                            <TextField
                                key={f.key}
                                fullWidth
                                select={Boolean(f.options)}
                                size="small"
                                label={f.label}
                                required={
                                    config.requiredKeys
                                        ? config.requiredKeys.includes(f.key)
                                        : index < 2
                                }
                                disabled={
                                    Boolean(config.readOnlyKeys?.includes(f.key)) ||
                                    (Boolean(editing) &&
                                        Boolean(config.lockedOnEdit?.includes(f.key)))
                                }
                                error={Boolean(fieldErrors[f.key])}
                                helperText={
                                    fieldErrors[f.key] ||
                                    (config.readOnlyKeys?.includes(f.key)
                                        ? 'Set by the system'
                                        : undefined)
                                }
                                value={fields[f.key] ?? ''}
                                onChange={(e) => {
                                    setFields((old) => ({
                                        ...old,
                                        [f.key]: e.target.value,
                                    }));

                                    setFieldErrors((old) => ({
                                        ...old,
                                        [f.key]: '',
                                    }));
                                }}
                                multiline={['remarks', 'reason'].includes(f.key)}
                                minRows={['remarks', 'reason'].includes(f.key) ? 1 : undefined}
                            >
                                {f.options?.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ))}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}><Button size="small" onClick={() => setFormOpen(false)}>Cancel</Button><Button size="small" variant="contained" onClick={save}>Submit</Button></DialogActions>
        </Dialog>
        <ConfirmDialog open={confirmOpen} title="Confirm Request" message={`Confirm ${editing ? 'updating' : 'creating'} this request?`} onCancel={() => setConfirmOpen(false)} onConfirm={commit} />
    </Box>;
}
