import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveTheme } from '@/redux/slices/themeSlice';
import { themeManagementService } from '@/services/themeManagement.service';
import type { BankTheme } from '@/types/theme';
import ThemeFormDialog from './components/ThemeFormDialog';

function ColorDot({ color }: { color: string }) {
  return <Box component="span" sx={{ display: 'inline-block', width: 17, height: 17, borderRadius: '50%', bgcolor: color, border: 1, borderColor: 'divider', verticalAlign: 'middle', mr: 0.75 }} />;
}

export default function ChangeColourThemePage() {
  const dispatch = useAppDispatch();
  const activeTheme = useAppSelector((state) => state.theme.theme);
  const [themes, setThemes] = useState<BankTheme[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BankTheme | null>(null);
  const [deleting, setDeleting] = useState<BankTheme | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadThemes = async () => {
    setLoading(true);
    try { setThemes(await themeManagementService.list()); }
    catch (error) { setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load colour themes.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadThemes(); }, []);

  const filtered = useMemo(() => themes.filter((theme) => `${theme.name} ${theme.shortName} ${theme.code}`.toLowerCase().includes(search.toLowerCase())), [themes, search]);

  const saveTheme = async (theme: BankTheme, isNew: boolean) => {
    if (isNew && themes.some((item) => item.code === theme.code)) throw new Error('This theme code already exists. Choose a unique theme code.');
    const saved = await themeManagementService.save(theme, isNew);
    setThemes((old) => old.some((item) => item.code === saved.code) ? old.map((item) => item.code === saved.code ? saved : item) : [...old, saved]);
    if (activeTheme.code === saved.code) dispatch(setActiveTheme(saved));
    setFormOpen(false); setEditing(null);
    setFeedback({ type: 'success', message: `${saved.name} theme ${isNew ? 'created' : 'updated'} successfully.` });
  };

  const deleteTheme = async () => {
    if (!deleting) return;
    await themeManagementService.remove(deleting.code);
    setThemes((old) => old.filter((item) => item.code !== deleting.code));
    setFeedback({ type: 'success', message: `${deleting.name} theme deleted successfully.` });
    setDeleting(null);
  };

  const columns: DataTableColumn<BankTheme>[] = [
    { key: 'name', label: 'Theme / Bank', minWidth: 220, render: (theme) => <Box><Typography fontWeight={750}>{theme.name}</Typography><Typography variant="caption" color="text.secondary">{theme.code} · {theme.shortName}</Typography></Box> },
    { key: 'type', label: 'Theme type', minWidth: 140, render: (theme) => <Chip size="small" label={theme.code === 'allianza' ? 'Control Panel' : 'Bank Portal'} color={theme.code === 'allianza' ? 'primary' : 'default'} variant="outlined" sx={{ fontWeight: 700 }} /> },
    { key: 'web', label: 'Web portal primary', minWidth: 165, render: (theme) => <Stack direction="row" alignItems="center"><ColorDot color={theme.colors.primary} /><Typography variant="body2" fontWeight={650}>{theme.colors.primary}</Typography></Stack> },
    { key: 'mobile', label: 'Mobile app primary', minWidth: 165, render: (theme) => <Stack direction="row" alignItems="center"><ColorDot color={theme.mobileColors?.primary ?? theme.colors.primary} /><Typography variant="body2" fontWeight={650}>{theme.mobileColors?.primary ?? theme.colors.primary}</Typography></Stack> },
    { key: 'status', label: 'Status', minWidth: 110, render: (theme) => <Chip size="small" label={activeTheme.code === theme.code ? 'Currently applied' : 'Configured'} color={activeTheme.code === theme.code ? 'success' : 'default'} sx={{ fontWeight: 700 }} /> },
    { key: 'actions', label: 'Actions', minWidth: 100, nowrap: true, render: (theme) => <Stack direction="row" spacing={0.25}><Tooltip title="Edit theme"><IconButton size="small" color="primary" onClick={() => { setEditing(theme); setFormOpen(true); }}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title={theme.code === 'allianza' ? 'Platform theme cannot be deleted' : 'Delete theme'}><span><IconButton size="small" color="error" disabled={theme.code === 'allianza'} onClick={() => setDeleting(theme)}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton></span></Tooltip></Stack> },
  ];

  return <Box>
    <PageHeader title="Change Colour Theme" subtitle="Manage the Allianza control panel theme and separate web banking portal and mobile app colours." actions={<Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => { setEditing(null); setFormOpen(true); }} sx={{ borderRadius: 2, px: 2.5 }}>Add Bank Theme</Button>} />
    {feedback && <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ mb: 2 }}>{feedback.message}</Alert>}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mb: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}><Stack direction="row" spacing={1.25} alignItems="center"><PaletteOutlinedIcon color="primary" /><Box><Typography variant="caption" color="text.secondary">Configured themes</Typography><Typography variant="h5" fontWeight={800}>{themes.length}</Typography></Box></Stack></Paper>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}><Typography variant="caption" color="text.secondary">Control Panel theme</Typography><Typography variant="h6" fontWeight={800}>Allianza</Typography><Typography variant="caption" color="text.secondary">Platform-wide admin branding</Typography></Paper>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}><Typography variant="caption" color="text.secondary">Currently applied portal</Typography><Stack direction="row" alignItems="center" spacing={0.75}><ColorDot color={activeTheme.colors.primary} /><Typography variant="h6" fontWeight={800}>{activeTheme.shortName}</Typography></Stack></Paper>
    </Box>
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box><Typography variant="h6" fontWeight={750}>Theme configuration</Typography><Typography variant="body2" color="text.secondary">Edit colours using the colour picker or choose a ready-made palette.</Typography></Box>
        <TextField size="small" placeholder="Search themes" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: { xs: '100%', sm: 300 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
      </Box>
      {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading themes…</Typography></Box> : <DataTable rows={filtered} columns={columns} getRowId={(theme) => theme.code} emptyMessage="No colour themes match your search." />}
    </Paper>
    <ThemeFormDialog open={formOpen} theme={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={saveTheme} />
    <ConfirmDialog open={!!deleting} title="Delete colour theme?" message={`Are you sure you want to delete “${deleting?.name ?? ''}”? Banks using this theme will need another configured theme.`} confirmText="Delete theme" variant="danger" onCancel={() => setDeleting(null)} onConfirm={() => { void deleteTheme().catch((error) => { setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Unable to delete theme.' }); setDeleting(null); }); }} />
  </Box>;
}
