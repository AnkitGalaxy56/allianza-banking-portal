import type { ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  type DialogProps,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export interface FormDialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  fullWidth?: boolean;
  busy?: boolean;
  disableBackdropClose?: boolean;
  contentPadding?: number | { xs?: number; sm?: number; md?: number };
  ariaLabelledBy?: string;
}

/** Reusable MUI Dialog shell; fields, form submit and actions remain owned by the feature. */
export default function FormDialog({
  open,
  title,
  description,
  children,
  onClose,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  busy = false,
  disableBackdropClose = false,
  contentPadding = { xs: 2, sm: 3 },
  ariaLabelledBy = 'form-dialog-title',
}: FormDialogProps) {
  const handleClose: DialogProps['onClose'] = (_event, reason) => {
    if (busy) return;
    if (disableBackdropClose && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll="paper"
      disableEscapeKeyDown={busy || disableBackdropClose}
      PaperProps={{ sx: { borderRadius: 3 } }}
      aria-labelledby={ariaLabelledBy}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
        <div>
          <Typography id={ariaLabelledBy} variant="h6" fontWeight={800}>{title}</Typography>
          {description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{description}</Typography>}
        </div>
        <IconButton aria-label="Close dialog" onClick={onClose} disabled={busy} size="small">
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: contentPadding }}>
        {children}
      </DialogContent>
      {actions && <DialogActions sx={{ p: { xs: 2, sm: 2.5 } }}>{actions}</DialogActions>}
    </Dialog>
  );
}
