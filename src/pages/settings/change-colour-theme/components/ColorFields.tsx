import { type ChangeEvent } from 'react';
import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import type { BankThemeColors } from '@/types/theme';
import { COLOR_FIELDS } from '../data/themePalettes';

export default function ColorFields({ title, colors, onChange }: { title: string; colors: BankThemeColors; onChange: (key: keyof BankThemeColors, value: string) => void }) {
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

