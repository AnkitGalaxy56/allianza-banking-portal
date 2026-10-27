import type { ReactNode } from 'react';
import { Box, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';

export const panelSx = { border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none', overflow: 'hidden' };
export const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } };
export const branches = ['All branches', 'Main branch', 'Branch 2', 'Branch 4', 'Branch 7'];

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <Paper sx={panelSx}><Box sx={{ px: 2.5, py: 2 }}><Typography fontWeight={750}>{title}</Typography></Box><Divider />{children}</Paper>;
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <FormControl fullWidth size="small" sx={fieldSx}><InputLabel>{label}</InputLabel><Select label={label} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select></FormControl>;
}
