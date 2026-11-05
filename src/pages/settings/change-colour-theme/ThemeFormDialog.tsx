import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import {
  Alert, Box, Button, Divider, Grid, Stack, TextField, Typography,
} from '@mui/material';
import FormDialog from '@/components/form/FormDialog';
import type { BankTheme, BankThemeColors } from '@/types/theme';

const DEFAULT_COLORS: BankThemeColors = {
  primary: '#0B453B', primaryDark: '#08352D', primaryTint: '#E5F0EB',
  authPanel: '#08352D', background: '#F5F6F2', surface: '#FFFFFF',
  textPrimary: '#15352D', textSecondary: '#5B6B63', border: '#D8E1DA',
};

const PRESETS = [
  { name: 'Forest', colors: { ...DEFAULT_COLORS } },
  { name: 'Ocean', colors: { ...DEFAULT_COLORS, primary: '#155E9A', primaryDark: '#103B66', primaryTint: '#E1EFFB', authPanel: '#103B66', background: '#F3F7FC', textPrimary: '#15283D', textSecondary: '#5D7188', border: '#D5E1EF' } },
  { name: 'Royal', colors: { ...DEFAULT_COLORS, primary: '#5B3A9E', primaryDark: '#35205F', primaryTint: '#EEE8FA', authPanel: '#35205F', background: '#F7F5FB', textPrimary: '#251B36', textSecondary: '#6C627B', border: '#E0D9EC' } },
  { name: 'Ruby', colors: { ...DEFAULT_COLORS, primary: '#A52845', primaryDark: '#64152A', primaryTint: '#F9E7EC', authPanel: '#64152A', background: '#FCF5F6', textPrimary: '#321821', textSecondary: '#765B63', border: '#EBD4DB' } },
  { name: 'Amber', colors: { ...DEFAULT_COLORS, primary: '#B65B12', primaryDark: '#713609', primaryTint: '#FFF0DD', authPanel: '#713609', background: '#FFFAF3', textPrimary: '#352719', textSecondary: '#796854', border: '#EEDCC5' } },
];

const COLOR_FIELDS: { key: keyof BankThemeColors; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary colour', hint: 'Main buttons, links and highlights' },
  { key: 'primaryDark', label: 'Primary dark', hint: 'Dark navigation and hover states' },
  { key: 'primaryTint', label: 'Primary light tint', hint: 'Selected menu and soft highlights' },
  { key: 'authPanel', label: 'Login panel', hint: 'Login screen accent background' },
  { key: 'background', label: 'Page background', hint: 'Main application background' },
  { key: 'surface', label: 'Card / surface', hint: 'Cards, dialogs and table surfaces' },
  { key: 'textPrimary', label: 'Primary text', hint: 'Headings and main content' },
  { key: 'textSecondary', label: 'Secondary text', hint: 'Descriptions and helper text' },
  { key: 'border', label: 'Border colour', hint: 'Dividers, outlines and input borders' },
];

interface Props {
  open: boolean;
  theme: BankTheme | null;
  onClose: () => void;
  onSave: (theme: BankTheme, isNew: boolean) => Promise<void>;
}

function ColorFields({ title, colors, onChange }: { title: string; colors: BankThemeColors; onChange: (key: keyof BankThemeColors, value: string) => void }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>{title}</Typography>
      <Grid container spacing={1.5}>
        {COLOR_FIELDS.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.key}>
            <Box sx={{ p: 1.25, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box component="input" type="color" aria-label={field.label} value={colors[field.key] || '#000000'} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(field.key, event.target.value)} sx={{ width: 42, height: 38, p: 0.25, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', cursor: 'pointer' }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>{field.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{field.hint}</Typography>
                </Box>
              </Stack>
              <TextField size="small" fullWidth value={colors[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)} sx={{ mt: 1 }} inputProps={{ maxLength: 7, 'aria-label': `${field.label} hex value` }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function ThemeFormDialog({ open, theme, onClose, onSave }: Props) {
  const isNew = !theme;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [tagline, setTagline] = useState('');
  const [webColors, setWebColors] = useState<BankThemeColors>(DEFAULT_COLORS);
  const [mobileColors, setMobileColors] = useState<BankThemeColors>(DEFAULT_COLORS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCode(theme?.code ?? ''); setName(theme?.name ?? ''); setShortName(theme?.shortName ?? '');
    setTagline(theme?.tagline ?? ''); setWebColors(theme?.colors ?? DEFAULT_COLORS);
    setMobileColors(theme?.mobileColors ?? theme?.colors ?? DEFAULT_COLORS); setError('');
  }, [open, theme]);

  const valid = useMemo(() => /^#[0-9a-fA-F]{6}$/.test(webColors.primary) && COLOR_FIELDS.every((field) => /^#[0-9a-fA-F]{6}$/.test(webColors[field.key] || '')) && COLOR_FIELDS.every((field) => /^#[0-9a-fA-F]{6}$/.test(mobileColors[field.key] || '')), [webColors, mobileColors]);
  const changeColor = (setter: Dispatch<SetStateAction<BankThemeColors>>) => (key: keyof BankThemeColors, value: string) => setter((old) => ({ ...old, [key]: value }));

  const submit = async () => {
    if (!name.trim() || !shortName.trim() || !code.trim()) { setError('Theme name, short name and theme code are required.'); return; }
    if (!valid) { setError('Enter valid six-digit HEX colours, for example #0B453B.'); return; }
    setSaving(true); setError('');
    try {
      await onSave({ code: code.trim().toLowerCase(), name: name.trim(), shortName: shortName.trim(), tagline: tagline.trim(), colors: webColors, mobileColors, borderRadius: theme?.borderRadius ?? 12, logoUrl: theme?.logoUrl }, isNew);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save theme.'); }
    finally { setSaving(false); }
  };

  return (
    <FormDialog open={open} onClose={onClose} title={isNew ? 'Add colour theme' : `Edit ${theme?.name ?? 'theme'}`} description="Configure separate colour palettes for the web banking portal and mobile banking app." maxWidth="lg" busy={saving} contentPadding={{ xs: 2, sm: 3 }}
      actions={<Stack direction="row" spacing={1}><Button onClick={onClose} disabled={saving} color="inherit">Cancel</Button><Button variant="contained" onClick={submit} disabled={saving || !valid}>{saving ? 'Saving…' : isNew ? 'Create theme' : 'Save changes'}</Button></Stack>}>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={4}><TextField label="Theme code" fullWidth size="small" value={code} onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, '-'))} disabled={!isNew || theme?.code === 'allianza'} helperText="Unique ID, e.g. sample-urban" /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Bank / theme name" fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Short name" fullWidth size="small" value={shortName} onChange={(e) => setShortName(e.target.value)} /></Grid>
          <Grid item xs={12}><TextField label="Tagline" fullWidth size="small" value={tagline} onChange={(e) => setTagline(e.target.value)} /></Grid>
        </Grid>
        <Box>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>Quick colour palettes</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {PRESETS.map((preset) => <Button key={preset.name} size="small" variant="outlined" onClick={() => { setWebColors(preset.colors); setMobileColors(preset.colors); }} startIcon={<Box sx={{ width: 13, height: 13, borderRadius: '50%', bgcolor: preset.colors.primary, border: 1, borderColor: 'divider' }} />}>{preset.name}</Button>)}
          </Stack>
        </Box>
        <Divider />
        <ColorFields title="Web banking portal theme" colors={webColors} onChange={changeColor(setWebColors)} />
        <Divider />
        <ColorFields title="Mobile banking app theme" colors={mobileColors} onChange={changeColor(setMobileColors)} />
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: webColors.background, border: 1, borderColor: webColors.border }}>
          <Typography variant="caption" sx={{ color: webColors.textSecondary }}>WEB PORTAL PREVIEW</Typography>
          <Box sx={{ mt: 1, p: 1.5, borderRadius: 2, bgcolor: webColors.surface, border: 1, borderColor: webColors.border }}>
            <Typography fontWeight={800} sx={{ color: webColors.textPrimary }}>{name || 'Bank Portal'}</Typography>
            <Typography variant="body2" sx={{ color: webColors.textSecondary }}>{tagline || 'Banking made simple'}</Typography>
            <Button size="small" variant="contained" sx={{ mt: 1, bgcolor: webColors.primary, '&:hover': { bgcolor: webColors.primaryDark } }}>Sample action</Button>
          </Box>
        </Box>
      </Stack>
    </FormDialog>
  );
}
