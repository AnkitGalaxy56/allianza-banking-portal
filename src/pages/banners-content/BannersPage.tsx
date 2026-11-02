import { useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormDialog from '@/components/form/FormDialog';
import { branches, fieldSx, panelSx, SelectField } from './components/BannerFormFields';
import { bannersDemo } from './data/bannersDemo';
import { announcementSchema } from './schemas/bannerSchema';
import type { Banner } from './types/banner';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(bannersDemo);
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [scope, setScope] = useState('All branches');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [confirm, setConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingPublish, setPendingPublish] = useState<'publish' | 'draft' | null>(null);

  useEffect(() => {
    if (!uploadFile) {
      setUploadPreview('');
      return;
    }
    const url = URL.createObjectURL(uploadFile);
    setUploadPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadFile]);

  const closeUpload = () => {
    setUploadOpen(false);
    setUploadFile(null);
  };

  const handleUpload = () => {
    if (!uploadFile) return;
    setToast(`“${uploadFile.name}” selected. Connect the banner upload API to store it permanently.`);
    closeUpload();
  };

  const resetForm = () => {
    setHeading('');
    setText('');
    setStart('');
    setEnd('');
    setScope('All branches');
    setFieldErrors({});
  };

  const closeEdit = () => {
    setEditing(null);
    resetForm();
  };

  const save = (draft: boolean) => {
    const parsed = announcementSchema.safeParse({ scope, heading, text, start, end });
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      return;
    }
    setFieldErrors({});
    setPendingPublish(draft ? 'draft' : 'publish');
  };

  const confirmSave = () => {
    if (!pendingPublish) return;
    const draft = pendingPublish === 'draft';
    const parsed = announcementSchema.safeParse({ scope, heading, text, start, end });
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      setPendingPublish(null);
      return;
    }

    const existingDateLabel = editing === null ? '' : banners[editing]?.scope.split(' · ').slice(1).join(' · ') ?? '';
    const dateLabel = parsed.data.start && parsed.data.end
      ? `${parsed.data.start} – ${parsed.data.end}`
      : editing !== null ? (existingDateLabel || 'No end date') : draft ? 'Draft' : 'No end date';
    const item: Banner = {
      title: parsed.data.heading,
      announcementText: parsed.data.text,
      scope: `${parsed.data.scope} · ${dateLabel}`,
      status: draft ? 'inactive' : 'active',
      tone: editing === null ? '#dcefed' : banners[editing]?.tone ?? '#dcefed',
    };

    setBanners(old => editing === null ? [item, ...old] : old.map((banner, index) => index === editing ? item : banner));
    setToast(editing === null
      ? draft ? 'Announcement saved as draft in demo mode.' : 'Announcement published in demo mode.'
      : 'Banner updated successfully in demo mode.');
    setPendingPublish(null);
    setEditing(null);
    resetForm();
  };

  const edit = (index: number) => {
    const banner = banners[index];
    setEditing(index);
    setHeading(banner.title);
    setText(banner.announcementText ?? '');
    setScope(banner.scope.split(' · ')[0]);
    setStart('');
    setEnd('');
    setFieldErrors({});
  };

  const formFields = (
    <Stack spacing={2}>
      <SelectField label="Show on" value={scope} onChange={setScope} options={branches} />
      <TextField
        label="Heading"
        placeholder="Short heading"
        value={heading}
        onChange={event => setHeading(event.target.value)}
        error={!!fieldErrors.heading}
        helperText={fieldErrors.heading}
        inputProps={{ maxLength: 60 }}
        fullWidth
        sx={fieldSx}
      />
      <TextField
        label="Text"
        placeholder="Announcement text shown on the home screen"
        value={text}
        onChange={event => setText(event.target.value)}
        multiline
        minRows={4}
        error={!!fieldErrors.text}
        helperText={fieldErrors.text}
        inputProps={{ maxLength: 500 }}
        fullWidth
        sx={fieldSx}
      />
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <TextField label="Start date" type="date" value={start} onChange={event => setStart(event.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="End date" type="date" value={end} onChange={event => setEnd(event.target.value)} error={!!fieldErrors.end} helperText={fieldErrors.end} inputProps={{ min: start || undefined }} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
        </Grid>
      </Grid>
    </Stack>
  );

  return (
    <Box>
      <PageHeader title="Banners & Content" subtitle="Banners and announcements shown to your customers on the app home screen" />
      {toast && <Alert severity="success" onClose={() => setToast('')} sx={{ mb: 2 }}>{toast}</Alert>}

      <Grid container spacing={2.5} alignItems="flex-start">
        <Grid item xs={12} lg={12}>
          <Paper sx={panelSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" p={2.5}>
              <Typography fontWeight={750}>Banners</Typography>
              <Button variant="contained" startIcon={<ImageOutlinedIcon />} onClick={() => { setUploadFile(null); setUploadOpen(true); }}>
                Upload banner
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ px: 2.5, pb: 2.5 }}>
              {banners.map((banner, index) => (
                <Grid item xs={12} sm={6} key={`${banner.title}-${index}`}>
                  <Paper sx={panelSx}>
                    <Box sx={{ height: 120, bgcolor: banner.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                      <Typography variant="body2" fontWeight={700}>Banner image · 1200 × 400</Typography>
                    </Box>
                    <Box p={1.75}>
                      <Stack direction="row" justifyContent="space-between" gap={1}>
                        <Typography fontWeight={750} variant="body2">{banner.title}</Typography>
                        <StatusChip status={banner.status} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>{banner.scope}</Typography>
                      <Stack direction="row" spacing={1.5} mt={1}>
                        <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => edit(index)}>Edit</Button>
                        <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => setToast('Image replacement requires the banner upload API.')}>Replace image</Button>
                        <Button size="small" color="error" sx={{ p: 0, minWidth: 0 }} onClick={() => setConfirm(index)}>Remove</Button>
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

      </Grid>

      <FormDialog
        open={uploadOpen}
        title="Upload banner"
        description="Choose a banner image to preview before uploading."
        onClose={closeUpload}
        maxWidth="sm"
        actions={
          <>
            <Button color="inherit" onClick={closeUpload}>Cancel</Button>
            <Button variant="contained" onClick={handleUpload} disabled={!uploadFile}>Upload</Button>
          </>
        }
      >
        <Stack spacing={2.5}>
          <Stack spacing={1.5}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageOutlinedIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Choose image
              <input
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    setToast('Please select a valid image file.');
                    event.target.value = '';
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setToast('Banner image must be 5 MB or smaller.');
                    event.target.value = '';
                    return;
                  }
                  setUploadFile(file);
                  event.target.value = '';
                }}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              PNG, JPG or WEBP · Maximum file size 5 MB
            </Typography>
            {uploadFile && (
              <Box>
                <Typography variant="body2" fontWeight={650}>{uploadFile.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(uploadFile.size / 1024).toFixed(1)} KB
                </Typography>
                {uploadPreview && (
                  <Box
                    component="img"
                    src={uploadPreview}
                    alt="Selected banner preview"
                    sx={{ display: 'block', width: '100%', maxHeight: 220, objectFit: 'contain', mt: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}
                  />
                )}
              </Box>
            )}
          </Stack>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={750} mb={2}>Announcement</Typography>
            {formFields}
          </Paper>
        </Stack>
      </FormDialog>

      <FormDialog
        open={editing !== null}
        title="Edit banner"
        description="Update the banner heading, announcement, branch and display dates."
        onClose={closeEdit}
        maxWidth="sm"
        actions={
          <>
            <Button color="inherit" onClick={closeEdit}>Cancel</Button>
            <Button variant="contained" onClick={() => save(false)}>Save changes</Button>
          </>
        }
      >
        {formFields}
      </FormDialog>

      <ConfirmDialog
        open={pendingPublish !== null}
        title={pendingPublish === 'draft' ? 'Save announcement draft?' : editing !== null ? 'Update banner?' : 'Publish announcement?'}
        message={pendingPublish === 'draft'
          ? `Save “${heading}” as a draft?`
          : editing !== null ? `Save changes to “${heading}”?` : `Publish “${heading}” to ${scope.toLowerCase()}?`}
        variant="warning"
        confirmText={pendingPublish === 'draft' ? 'Save draft' : editing !== null ? 'Save changes' : 'Publish'}
        onCancel={() => setPendingPublish(null)}
        onConfirm={confirmSave}
      />

      <ConfirmDialog
        open={confirm !== null}
        title="Remove banner?"
        message={`Are you sure you want to remove “${confirm === null ? '' : banners[confirm]?.title}”? This action affects the displayed banner list.`}
        variant="danger"
        confirmText="Remove"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm !== null) setBanners(old => old.filter((_, index) => index !== confirm));
          setConfirm(null);
          setToast('Banner removed from demo list.');
        }}
      />
    </Box>
  );
}
