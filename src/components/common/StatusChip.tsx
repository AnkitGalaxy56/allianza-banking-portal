import { alpha, Chip } from '@mui/material';

type Tone = 'info' | 'warning' | 'success' | 'error';

const STATUS_CONFIG: Record<string, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'info' },
  in_review: { label: 'In review', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'error' },
  active: { label: 'Active', tone: 'success' },
  inactive: { label: 'Inactive', tone: 'warning' },
};

export default function StatusChip({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: 'info' as Tone };
  return (
    <Chip
      size="small"
      label={config.label}
      sx={(theme) => ({
        height: 24,
        borderRadius: 999,
        bgcolor: alpha(theme.palette[config.tone].main, 0.14),
        color: theme.palette[config.tone].dark,
      })}
    />
  );
}
