import { useState } from 'react';
import { Badge, Box, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

/** Header notifications panel. Connect this list to the notifications API when available. */
export default function NotificationsPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton aria-label="Notifications" onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Badge variant="dot" color="error"><NotificationsNoneOutlinedIcon /></Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 320, maxWidth: 'calc(100vw - 24px)', borderRadius: 2, mt: 1 } }}
      >
        <Box sx={{ px: 2, py: 1.75 }}>
          <Typography fontWeight={700}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>You’re all caught up.</Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">New alerts and updates will appear here.</Typography>
        </Box>
      </Popover>
    </>
  );
}
