import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RoleFormDrawer from './components/RoleFormDrawer';
import RoleDetailsDrawer from './components/RoleDetailsDrawer';
import { useEffect } from 'react';
import { settingsService } from '@/services/settings.service';
import type { AccessRole } from './types/role';

export default function RolesAccessControlPage() {
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AccessRole | null>(null);
  const [viewing, setViewing] = useState<AccessRole | null>(null);
  const [deleting, setDeleting] = useState<AccessRole | null>(null);
  const [feedback, setFeedback] = useState('');
  useEffect(() => { let active = true; settingsService.listRoles().then(items => { if (active) setRoles(items); }).catch(e => { if (active) setLoadError(e instanceof Error ? e.message : 'Unable to load roles.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const filtered = useMemo(() => roles.filter(r => `${r.name} ${r.description}`.toLowerCase().includes(search.toLowerCase())), [roles, search]);
  const saveRole = async (role: AccessRole) => {
    try {
      const saved = editing ? await settingsService.updateRole(role.id, role) : await settingsService.createRole(role);
      setRoles(old => old.some(r => r.id === saved.id) ? old.map(r => r.id === saved.id ? saved : r) : [saved, ...old]);
      setFormOpen(false); setEditing(null); setFeedback(`Role ${saved.name} ${editing ? 'updated' : 'created'} successfully.`);
    } catch (e) { setLoadError(e instanceof Error ? e.message : 'Unable to save role.'); }
  };
  const columns: DataTableColumn<AccessRole>[] = [
    { key: 'name', label: 'Role Name', minWidth: 165, render: r => <Box><Typography fontWeight={750}>{r.name}</Typography><Typography variant="caption" color="text.secondary">{r.systemRole ? 'System role' : 'Custom role'}</Typography></Box> },
    { key: 'description', label: 'Description', minWidth: 230, render: r => <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>{r.description}</Typography> },
    { key: 'assigned', label: 'Assigned Users', minWidth: 115, align: 'center', render: r => r.assignedUsers },
    { key: 'permissions', label: 'Permissions', minWidth: 145, render: r => <Stack direction="row" spacing={0.75} alignItems="center"><KeyOutlinedIcon fontSize="small" color="action" /><Typography variant="body2" noWrap>{r.permissions.reduce((n,p) => n + p.actions.length, 0)} permissions</Typography></Stack> },
    { key: 'status', label: 'Status', minWidth: 100, render: r => <Chip size="small" label={r.status} color={r.status === 'Active' ? 'success' : 'default'} sx={{ fontWeight: 750 }} /> },
    { key: 'actions', label: 'Actions', minWidth: 170, nowrap: true, render: r => <Stack direction="row" spacing={0.25}><Tooltip title="View"><IconButton size="small" color="primary" onClick={() => setViewing(r)}><VisibilityOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Edit"><span><IconButton size="small" color="primary" onClick={() => { setEditing(r); setFormOpen(true); }}><EditOutlinedIcon fontSize="small" /></IconButton></span></Tooltip><Tooltip title={r.systemRole ? 'System roles cannot be deleted' : 'Delete'}><span><IconButton size="small" color="error" disabled={r.systemRole || r.assignedUsers > 0} onClick={() => setDeleting(r)}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton></span></Tooltip></Stack> },
  ];
  return <Box>
    <PageHeader title="Role & Access Management" subtitle="Configure which web screens each user role can open and which actions are available." actions={<Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => { setEditing(null); setFormOpen(true); }} sx={{ borderRadius: 2, px: 2.5 }}>Add Role</Button>} />
    {loadError && <Alert severity="error" onClose={() => setLoadError('')} sx={{ mb: 2 }}>{loadError}</Alert>}
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}><Box><Typography variant="h6" fontWeight={750}>Roles</Typography><Typography variant="body2" color="text.secondary">Manage screen access by user role</Typography></Box><TextField size="small" placeholder="Search roles" value={search} onChange={e => setSearch(e.target.value)} sx={{ width: { xs: '100%', sm: 320 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} /></Box>
      <DataTable rows={filtered} columns={columns} getRowId={r => r.id} emptyMessage={loading ? "Loading roles…" : "No roles match your search."} />
    </Paper>
    <RoleFormDrawer open={formOpen} role={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={saveRole} />
    <RoleDetailsDrawer open={!!viewing} role={viewing} onClose={() => setViewing(null)} />
    <ConfirmDialog open={!!deleting} title="Delete role?" message={`Are you sure you want to delete “${deleting?.name ?? ''}”? This action cannot be undone.`} confirmText="Delete role" variant="danger" onCancel={() => setDeleting(null)} onConfirm={() => { if (!deleting) return; void settingsService.deleteRole(deleting.id).then(() => { setRoles(old => old.filter(r => r.id !== deleting.id)); setFeedback(`Role ${deleting.name} deleted successfully.`); }).catch(e => setLoadError(e instanceof Error ? e.message : 'Unable to delete role.')).finally(() => setDeleting(null)); }} />
  </Box>;
}
