import type { ReactNode } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  divider?: boolean;
  outlined?: boolean;
  spacing?: number;
  className?: string;
}

/** Shared section wrapper for large forms; does not own form state or validation. */
export default function FormSection({
  title,
  description,
  action,
  children,
  divider = true,
  outlined = false,
  spacing = 2,
  className,
}: FormSectionProps) {
  return (
    <Box
      component="section"
      className={className}
      sx={{
        minWidth: 0,
        ...(outlined ? { border: 1, borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 } } : {}),
      }}
    >
      {(title || description || action) && (
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.5 }}>
          <Box sx={{ minWidth: 0 }}>
            {title && <Typography variant="subtitle1" fontWeight={800}>{title}</Typography>}
            {description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{description}</Typography>}
          </Box>
          {action}
        </Stack>
      )}
      {divider && (title || description || action) && <Divider sx={{ mb: 2 }} />}
      <Stack spacing={spacing}>{children}</Stack>
    </Box>
  );
}
