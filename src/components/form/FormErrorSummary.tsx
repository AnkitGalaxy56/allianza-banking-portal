import type { ReactNode } from 'react';
import { Alert, AlertTitle, Box, Button, List, ListItem, Typography } from '@mui/material';
import type { FieldErrors, FieldValues } from 'react-hook-form';

export interface FormErrorSummaryProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  title?: string;
  description?: string;
  labels?: Record<string, string>;
  onReviewErrors?: () => void;
  actionLabel?: string;
  severity?: 'error' | 'warning';
  icon?: ReactNode;
}

function collectErrorMessages(value: unknown, prefix = ''): Array<{ path: string; message: string }> {
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message.trim()) {
    return [{ path: prefix, message: record.message }];
  }
  return Object.entries(record)
    .filter(([key]) => !['ref', 'type', 'types', 'root', 'name'].includes(key))
    .flatMap(([key, child]) => collectErrorMessages(child, prefix ? `${prefix}.${key}` : key));
}

const humanizePath = (path: string): string =>
  path.split('.').map((part) => part.replace(/\[(\d+)\]/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')).join(' / ');

/** Summary for long forms with nested fields; schemas and actual rules stay in the feature. */
export default function FormErrorSummary<T extends FieldValues>({
  errors,
  title = 'Please check the form',
  description = 'Some fields need your attention.',
  labels,
  onReviewErrors,
  actionLabel = 'Review fields',
  severity = 'error',
  icon,
}: FormErrorSummaryProps<T>) {
  const items = collectErrorMessages(errors);
  if (!items.length) return null;

  return (
    <Alert severity={severity} icon={icon} sx={{ mb: 2, alignItems: 'flex-start' }}>
      <AlertTitle>{title}</AlertTitle>
      <Typography variant="body2">{description}</Typography>
      <List dense disablePadding sx={{ mt: 0.75, listStyleType: 'disc', pl: 2.5 }}>
        {items.map((item, index) => (
          <ListItem key={`${item.path}-${index}`} sx={{ display: 'list-item', py: 0.15, pl: 0 }}>
            <Typography variant="body2">
              <strong>{labels?.[item.path] ?? humanizePath(item.path)}:</strong> {item.message}
            </Typography>
          </ListItem>
        ))}
      </List>
      {onReviewErrors && <Box sx={{ mt: 1 }}><Button size="small" color="inherit" onClick={onReviewErrors}>{actionLabel}</Button></Box>}
    </Alert>
  );
}
