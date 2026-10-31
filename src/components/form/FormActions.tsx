import type { ReactNode } from 'react';
import { Box, Button, CircularProgress, Stack } from '@mui/material';

export interface FormActionsProps {
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  saving?: boolean;
  disabled?: boolean;
  showCancel?: boolean;
  formId?: string;
  submitType?: 'submit' | 'button';
  align?: 'right' | 'between' | 'left';
  extraActions?: ReactNode;
  fullWidthOnMobile?: boolean;
}

/** Consistent form footer with loading/disabled state; the parent owns submit logic. */
export default function FormActions({
  onCancel,
  cancelLabel = 'Cancel',
  submitLabel = 'Save',
  saving = false,
  disabled = false,
  showCancel = true,
  formId,
  submitType = 'submit',
  align = 'right',
  extraActions,
  fullWidthOnMobile = false,
}: FormActionsProps) {
  const justifyContent = align === 'left' ? 'flex-start' : align === 'between' ? 'space-between' : 'flex-end';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent, gap: 1.5, flexWrap: 'wrap', width: '100%' }}>
      {align === 'between' && <Box>{extraActions}</Box>}
      <Stack direction="row" spacing={1.25} sx={{ ml: align === 'between' ? 'auto' : 0, width: fullWidthOnMobile ? { xs: '100%', sm: 'auto' } : 'auto' }}>
        {align !== 'between' && extraActions}
        {showCancel && onCancel && (
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel} disabled={saving} fullWidth={fullWidthOnMobile}>
            {cancelLabel}
          </Button>
        )}
        <Button
          type={submitType}
          form={formId}
          variant="contained"
          disabled={disabled || saving}
          fullWidth={fullWidthOnMobile}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saving ? 'Saving…' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
