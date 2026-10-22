import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Stack, Typography, useTheme,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export type ConfirmDialogVariant = 'warning' | 'danger' | 'info';
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmText = 'Confirm', cancelText = 'Cancel',
  variant = 'warning', loading = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const styles = {
    warning: { color: theme.palette.warning.dark, bg: theme.palette.warning.light, icon: <WarningAmberRoundedIcon /> },
    danger: { color: theme.palette.error.dark, bg: theme.palette.error.light, icon: <ErrorOutlineRoundedIcon /> },
    info: { color: theme.palette.primary.main, bg: theme.palette.primary.light, icon: <CheckCircleOutlineRoundedIcon /> },
  }[variant];
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} fullWidth maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3, backgroundImage: 'none' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack alignItems="center" justifyContent="center"
            sx={{ width: 42, height: 42, borderRadius: 2, color: styles.color, bgcolor: styles.bg, flexShrink: 0 }}>
            {styles.icon}
          </Stack>
          <Typography component="span" variant="h6" fontWeight={750}>{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent><DialogContentText sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{message}</DialogContentText></DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" color="inherit" disabled={loading} onClick={onCancel}> {cancelText} </Button>
        <Button variant="contained" color={variant === 'danger' ? 'error' : 'primary'} disabled={loading} onClick={onConfirm}>
          {loading ? 'Please wait…' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
