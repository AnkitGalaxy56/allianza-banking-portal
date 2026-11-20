import { useEffect, useState } from 'react';
import { Badge, Box, Divider, IconButton, Popover, Tooltip, Typography, List, ListItem, ListItemText, Chip, Button, Alert } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { headerNotificationService, type HeaderNotification } from '@/services/notifications-header.service';

export default function NotificationsPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<HeaderNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const open = Boolean(anchorEl);
  const unreadCount = items.filter((item) => !readIds.includes(String(item.id))).length;

  const refresh = async () => {
    try { setItems(await headerNotificationService.list()); setError(''); }
    catch { setError('Unable to load notifications.'); }
  };
  useEffect(() => { void refresh(); }, []);

  const markAllAsRead = () => setReadIds(items.map((item) => String(item.id)));
  return (
    <>
      <Tooltip title="Notifications">
        <IconButton aria-label="Notifications" onClick={(event) => { setAnchorEl(event.currentTarget); void refresh(); }}>
          <Badge badgeContent={unreadCount} color="error"><NotificationsNoneOutlinedIcon /></Badge>
        </IconButton>
      </Tooltip>
      <Popover open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 360, maxWidth: 'calc(100vw - 24px)', borderRadius: 2, mt: 1 } }}>
        <Box sx={{ px: 2, py: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box><Typography fontWeight={700}>Notifications</Typography><Typography variant="caption" color="text.secondary">You have {unreadCount} unread notifications</Typography></Box>
          <Button size="small" onClick={markAllAsRead}>Mark all read</Button>
        </Box>
        <Divider />
        {error && <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>}
        <List disablePadding sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {items.map((item) => {
            const unread = !readIds.includes(String(item.id));
            return <ListItem key={item.id} alignItems="flex-start" sx={{ px: 2, py: 1.5, bgcolor: unread ? 'action.hover' : 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ mr: 1.5, mt: .5 }}><InfoOutlinedIcon color="info" /></Box>
              <ListItemText primary={<Typography variant="body2" fontWeight={700}>{item.title}</Typography>}
                secondary={<><Typography component="span" variant="body2" color="text.secondary">{item.message}</Typography><Typography display="block" variant="caption" color="text.secondary" sx={{ mt: .5 }}>{item.sentOn ?? item.createdOn ?? ''}{item.branch ? ` • ${item.branch}` : ''}</Typography></>} />
              {unread && <Chip label="New" size="small" color="primary" sx={{ ml: 1, height: 22 }} />}
            </ListItem>;
          })}
          {!items.length && !error && <ListItem><ListItemText primary="No notifications" /></ListItem>}
        </List>
        <Divider /><Box sx={{ p: 1.5, textAlign: 'center' }}><Typography variant="caption" color="text.secondary">Showing latest notifications</Typography></Box>
      </Popover>
    </>
  );
}
