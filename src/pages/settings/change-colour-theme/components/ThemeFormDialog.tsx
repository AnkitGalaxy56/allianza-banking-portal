import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import {
  Alert, Box, Button, Divider, Grid, Stack, TextField, Typography,
} from '@mui/material';
import FormDialog from '@/components/form/FormDialog';
import type { BankTheme, BankThemeColors } from '@/types/theme';
import { COLOR_FIELDS, DEFAULT_COLORS } from '../data/themePalettes';
import { isValidThemePalette } from '../schema/theme.schema';
import type { ThemeFormDialogProps } from '../types/theme.types';
import ColorFields from './ColorFields';


export default function ThemeFormDialog({ open, theme, onClose, onSave }: ThemeFormDialogProps) {
  const isNew = !theme;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [tagline, setTagline] = useState('');
  const [webColors, setWebColors] = useState<BankThemeColors>(DEFAULT_COLORS);
  const [mobileColors, setMobileColors] = useState<BankThemeColors>(DEFAULT_COLORS);
  const [paletteColor, setPaletteColor] = useState(DEFAULT_COLORS.primary);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCode(theme?.code ?? ''); setName(theme?.name ?? ''); setShortName(theme?.shortName ?? '');
    setTagline(theme?.tagline ?? ''); setWebColors(theme?.colors ?? DEFAULT_COLORS);
    setMobileColors(theme?.mobileColors ?? theme?.colors ?? DEFAULT_COLORS);
    setPaletteColor(theme?.colors?.primary ?? DEFAULT_COLORS.primary); setError('');
  }, [open, theme]);

  const valid = useMemo(() => isValidThemePalette(webColors) && isValidThemePalette(mobileColors), [webColors, mobileColors]);
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
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1.5 }}>
            <Box component="input" type="color" aria-label="Choose palette colour" value={paletteColor}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPaletteColor(event.target.value)}
              sx={{ width: 48, height: 40, p: 0.25, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', cursor: 'pointer' }} />
            <Typography variant="body2" color="text.secondary">Choose any colour, then select a shade below.</Typography>
            <Typography variant="body2" fontWeight={700}>{paletteColor.toUpperCase()}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            {Array.from({ length: 9 }, (_, index) => index).map((shade) => {
              const mix = (hex: string, target: number, amount: number) => {
                const value = hex.replace('#', '');
                const rgb = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
                return '#' + rgb.map((channel) => Math.round(channel + (target - channel) * amount).toString(16).padStart(2, '0')).join('');
              };
              const amount = (shade - 4) / 4;
              const color = amount < 0 ? mix(paletteColor, 255, -amount * 0.82) : amount > 0 ? mix(paletteColor, 0, amount * 0.72) : paletteColor;
              return <Button key={shade} aria-label={`Apply colour shade ${shade + 1}`} title={color.toUpperCase()}
                onClick={() => {
                  const primary = color;
                  const primaryDark = mix(primary, 0, 0.35);
                  const primaryTint = mix(primary, 255, 0.88);
                  const next = { ...webColors, primary, primaryDark, primaryTint, authPanel: primaryDark };
                  const nextMobile = { ...mobileColors, primary, primaryDark, primaryTint, authPanel: primaryDark };
                  setWebColors(next); setMobileColors(nextMobile);
                }}
                sx={{ minWidth: 0, width: 38, height: 38, p: 0, bgcolor: color, border: 2, borderColor: color.toLowerCase() === webColors.primary.toLowerCase() ? 'text.primary' : 'divider',
                  '&:hover': { bgcolor: color, opacity: 0.85 } }} />
            })}
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
