import { useMemo, useRef, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Snackbar, Stack,
  TextField, Typography,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { imageSchema } from './schemas/imageSchema';

type ImageType = 'Banner' | 'App Logo' | 'Icon' | 'Onboarding' | 'Promotion' | 'Other';
type ImageStatus = 'Active' | 'Inactive';
type AppImage = {
  id: string; name: string; type: ImageType; path: string; size: number;
  format: string; dimensions: string; altText: string;
  platform: 'Android' | 'iOS' | 'Both'; status: ImageStatus;
  updatedAt: string; previewUrl: string;
};
type ImageForm = Omit<AppImage, 'id' | 'updatedAt'>;
const emptyForm: ImageForm = { name: '', type: 'Banner', path: '', size: 0, format: '', dimensions: '', altText: '', platform: 'Both', status: 'Active', previewUrl: '' };
const initialImages: AppImage[] = [
  { id: 'img-001', name: 'Home Dashboard Banner', type: 'Banner', path: '/assets/mobile/home-dashboard-banner.png', size: 248 * 1024, format: 'PNG', dimensions: '1200 × 480', altText: 'Mobile banking dashboard promotional banner', platform: 'Both', status: 'Active', updatedAt: '2026-10-12', previewUrl: '' },
  { id: 'img-002', name: 'Allianza App Logo', type: 'App Logo', path: '/assets/mobile/allianza-logo.png', size: 42 * 1024, format: 'PNG', dimensions: '512 × 512', altText: 'Allianza mobile application logo', platform: 'Both', status: 'Active', updatedAt: '2026-10-08', previewUrl: '' },
  { id: 'img-003', name: 'Quick Transfer Icon', type: 'Icon', path: '/assets/mobile/quick-transfer.svg', size: 8 * 1024, format: 'SVG', dimensions: '96 × 96', altText: 'Quick money transfer icon', platform: 'Both', status: 'Active', updatedAt: '2026-10-03', previewUrl: '' },
  { id: 'img-004', name: 'Welcome Onboarding', type: 'Onboarding', path: '/assets/mobile/onboarding-welcome.webp', size: 316 * 1024, format: 'WEBP', dimensions: '1080 × 1440', altText: 'Welcome illustration for new mobile banking users', platform: 'Android', status: 'Inactive', updatedAt: '2026-09-28', previewUrl: '' },
];
const formatBytes = (bytes: number) => !bytes ? '—' : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
const today = () => new Date().toISOString().slice(0, 10);

export default function UploadImagesPage() {
  const [images, setImages] = useState<AppImage[]>(initialImages);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AppImage | null>(null);
  const [form, setForm] = useState<ImageForm>(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const rows = useMemo(() => images.filter((item) => {
    const matches = `${item.name} ${item.type} ${item.path} ${item.format} ${item.altText}`.toLowerCase().includes(search.trim().toLowerCase());
    return matches && (typeFilter === 'all' || item.type === typeFilter) && (statusFilter === 'all' || item.status === statusFilter);
  }), [images, search, typeFilter, statusFilter]);
  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setDialogOpen(true); };
  const openEdit = (item: AppImage) => { setEditing(item); const { id: _id, updatedAt: _date, ...values } = item; setForm(values); setError(''); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditing(null); setError(''); };
  const updateField = <K extends keyof ImageForm>(key: K, value: ImageForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const selectFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose a valid image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be 10 MB or smaller.'); return; }
    const previewUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => updateField('dimensions', `${image.naturalWidth} × ${image.naturalHeight}`);
    image.src = previewUrl;
    updateField('name', form.name || file.name.replace(/\.[^.]+$/, ''));
    updateField('path', `/uploads/mobile/${file.name}`);
    updateField('size', file.size);
    updateField('format', file.name.split('.').pop()?.toUpperCase() || file.type.split('/')[1]?.toUpperCase() || 'IMAGE');
    updateField('previewUrl', previewUrl);
    setError('');
  };
  const saveImage = () => {
    const parsed = imageSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check the image details.'); return; }
    if (images.some((item) => item.name.trim().toLowerCase() === parsed.data.name.trim().toLowerCase() && item.id !== editing?.id)) { setError('An image with this name already exists.'); return; }
    if (editing) {
      setImages((current) => current.map((item) => item.id === editing.id ? { ...parsed.data, id: editing.id, updatedAt: today() } : item));
      setMessage('Image details updated.');
    } else {
      setImages((current) => [...current, { ...parsed.data, id: `img-${Date.now()}`, updatedAt: today() }]);
      setMessage('Image added to the list.');
    }
    closeDialog();
  };

  const columns = useMemo<DataTableColumn<AppImage>[]>(() => [
    { key: 'image', label: 'Image', minWidth: 240, render: (item) => <Stack direction="row" spacing={1.5} alignItems="center">{item.previewUrl ? <Box component="img" src={item.previewUrl} alt={item.altText || item.name} sx={{ width: 48, height: 42, objectFit: 'contain', borderRadius: 1.5, border: 1, borderColor: 'divider', bgcolor: 'background.default' }} /> : <Avatar variant="rounded" sx={{ width: 48, height: 42, bgcolor: 'primary.light', color: 'primary.dark' }}><ImageOutlinedIcon /></Avatar>}<Box sx={{ minWidth: 0 }}><Typography fontWeight={700} fontSize={13}>{item.name}</Typography><Typography variant="caption" color="text.secondary">{item.format || 'Image'} · {item.dimensions || 'Dimensions unknown'}</Typography></Box></Stack> },
    { key: 'type', label: 'Type', minWidth: 115, render: (item) => <Chip size="small" label={item.type} variant="outlined" /> },
    { key: 'path', label: 'Path', minWidth: 240, render: (item) => <Typography variant="body2" sx={{ maxWidth: 300, overflowWrap: 'anywhere' }}>{item.path}</Typography> },
    { key: 'size', label: 'Size', minWidth: 90, render: (item) => formatBytes(item.size) },
    { key: 'dimensions', label: 'Dimensions', minWidth: 90, render: (item) => item.dimensions || '—'},
    { key: 'platform', label: 'Platform', minWidth: 100, render: (item) => item.platform },
    { key: 'status', label: 'Status', minWidth: 95, render: (item) => <Chip size="small" label={item.status} color={item.status === 'Active' ? 'success' : 'default'} /> },
    { key: 'updatedAt', label: 'Updated', minWidth: 105, render: (item) => item.updatedAt },
    { key: 'actions', label: 'Actions', align: 'right', minWidth: 125, nowrap: true, render: (item) => <Stack direction="row" spacing={0.25} justifyContent="flex-end"><Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEdit(item)}>Edit</Button></Stack> },
  ], [images]);

  return <Box>
    <PageHeader title="Upload Images" subtitle="Manage images and visual assets used in the mobile application" />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 2.5 }}>
      {[
        { label: 'Total images', value: images.length, icon: <ImageOutlinedIcon /> },
        { label: 'Active assets', value: images.filter((item) => item.status === 'Active').length, icon: <AddPhotoAlternateOutlinedIcon /> },
        { label: 'Storage represented', value: formatBytes(images.reduce((total, item) => total + item.size, 0)), icon: <CloudUploadOutlinedIcon /> },
      ].map((stat) => <Paper key={stat.label} variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>{stat.icon}</Avatar><Box><Typography variant="body2" color="text.secondary">{stat.label}</Typography><Typography variant="h6" fontWeight={800}>{stat.value}</Typography></Box></Paper>)}
    </Box>
    <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box><Typography variant="h6" fontWeight={800}>Mobile application images</Typography><Typography variant="body2" color="text.secondary">Image catalogue, file details and deployment status</Typography></Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or path" sx={{ width: { xs: '100%', sm: 230 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
          <TextField select size="small" label="Type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} sx={{ minWidth: 135 }}><MenuItem value="all">All types</MenuItem>{(['Banner', 'App Logo', 'Icon', 'Onboarding', 'Promotion', 'Other'] as ImageType[]).map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}</TextField>
          <TextField select size="small" label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} sx={{ minWidth: 125 }}><MenuItem value="all">All statuses</MenuItem><MenuItem value="Active">Active</MenuItem><MenuItem value="Inactive">Inactive</MenuItem></TextField>
          <Button variant="contained" startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={openAdd} sx={{ whiteSpace: 'nowrap' }}>Add Image</Button>
        </Stack>
      </Box>
      <DataTable rows={rows} columns={columns} getRowId={(item) => item.id} emptyMessage="No images match these filters. Add an image to get started." />
      <Box sx={{ px: 2.5, py: 1.75, borderTop: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">Showing {rows.length} of {images.length} image assets</Typography></Box>
    </Paper>
    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}><Box><Typography variant="h6" fontWeight={800}>{editing ? 'Edit Image' : 'Add Mobile Application Image'}</Typography><Typography variant="body2" color="text.secondary">Manage file, display and deployment metadata</Typography></Box><IconButton aria-label="Close" onClick={closeDialog}><CloseOutlinedIcon /></IconButton></DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2, pt: 0.5 }}>
          <Box sx={{ gridColumn: { xs: 'auto', sm: 'span 2' }, p: 2, border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {form.previewUrl ? <Box component="img" src={form.previewUrl} alt="Selected image preview" sx={{ width: 100, height: 80, objectFit: 'contain', borderRadius: 1, bgcolor: 'background.default' }} /> : <Avatar variant="rounded" sx={{ width: 100, height: 80, bgcolor: 'primary.light', color: 'primary.dark' }}><AddPhotoAlternateOutlinedIcon fontSize="large" /></Avatar>}
            <Box sx={{ flex: 1, minWidth: 180 }}><Typography fontWeight={700}>Image file</Typography><Typography variant="body2" color="text.secondary">Image formats supported · maximum 10 MB</Typography><Button sx={{ mt: 1 }} variant="outlined" startIcon={<CloudUploadOutlinedIcon />} onClick={() => fileRef.current?.click()}>Choose file</Button><input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => selectFile(event.target.files?.[0])} /></Box>{form.size > 0 && <Chip label={formatBytes(form.size)} />}
          </Box>
          <TextField label="Image Name" size="small" value={form.name} required inputProps={{ maxLength: 100 }} onChange={(event) => updateField('name', event.target.value)} />
          <TextField select label="Image Type" size="small" value={form.type} onChange={(event) => updateField('type', event.target.value as ImageType)}>{(['Banner', 'App Logo', 'Icon', 'Onboarding', 'Promotion', 'Other'] as ImageType[]).map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}</TextField>
          <TextField label="Image Path / URL" size="small" value={form.path} required inputProps={{ maxLength: 2048 }} onChange={(event) => updateField('path', event.target.value)} helperText="Storage path or URL returned by your upload API" sx={{ gridColumn: { xs: 'auto', sm: 'span 2' } }} />
          <TextField label="File Size (bytes)" size="small" type="number" value={form.size || ''} onChange={(event) => updateField('size', Math.max(0, Number(event.target.value)))} />
          <TextField label="File Format" size="small" value={form.format} onChange={(event) => updateField('format', event.target.value.toUpperCase())} placeholder="PNG, JPG, WEBP..." />
          <TextField label="Dimensions (width × height)" size="small" value={form.dimensions} onChange={(event) => updateField('dimensions', event.target.value)} placeholder="1200 × 480" />
          <TextField select label="Target Platform" size="small" value={form.platform} onChange={(event) => updateField('platform', event.target.value as ImageForm['platform'])}><MenuItem value="Both">Android & iOS</MenuItem><MenuItem value="Android">Android</MenuItem><MenuItem value="iOS">iOS</MenuItem></TextField>
          <TextField label="Alternative Text / Description" size="small" value={form.altText} onChange={(event) => updateField('altText', event.target.value)} sx={{ gridColumn: { xs: 'auto', sm: 'span 2' } }} />
          <TextField select label="Status" size="small" value={form.status} onChange={(event) => updateField('status', event.target.value as ImageStatus)}><MenuItem value="Active">Active</MenuItem><MenuItem value="Inactive">Inactive</MenuItem></TextField>
          <TextField label="Last Updated" size="small" value={editing?.updatedAt ?? today()} disabled />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}><Button onClick={closeDialog} color="inherit" variant="outlined">Cancel</Button><Button onClick={saveImage} variant="contained">{editing ? 'Save Changes' : 'Add Image'}</Button></DialogActions>
    </Dialog>
    <Snackbar open={Boolean(message)} autoHideDuration={3500} onClose={() => setMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="success" onClose={() => setMessage('')} variant="filled">{message}</Alert></Snackbar>
  </Box>;
}
