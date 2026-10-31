import { useState } from 'react';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const notifications = [
  {
    id: 1,
    title: 'Transaction Successful',
    message: '₹25,000 transferred successfully to Rahul Sharma.',
    time: '2 minutes ago',
    type: 'success',
    unread: true,
  },
  {
    id: 2,
    title: 'Payment Failed',
    message: 'Transaction of ₹5,000 failed due to insufficient balance.',
    time: '15 minutes ago',
    type: 'error',
    unread: true,
  },
  {
    id: 3,
    title: 'New User Registered',
    message: 'Amit Patil registered successfully.',
    time: '1 hour ago',
    type: 'user',
    unread: true,
  },
  {
    id: 4,
    title: 'System Update',
    message: 'Banking dashboard updated successfully.',
    time: '3 hours ago',
    type: 'info',
    unread: false,
  },
];

export default function NotificationsPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState(notifications);

  const open = Boolean(anchorEl);
  const unreadCount = items.filter((item) => item.unread).length;

  const markAllAsRead = () => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, unread: false }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" />;
      case 'error':
        return <ErrorOutlineIcon color="error" />;
      case 'user':
        return <PersonAddAltOutlinedIcon color="primary" />;
      default:
        return <InfoOutlinedIcon color="info" />;
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          aria-label="Notifications"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography fontWeight={700}>Notifications</Typography>
            <Typography variant="caption" color="text.secondary">
              You have {unreadCount} unread notifications
            </Typography>
          </Box>

          <Button size="small" onClick={markAllAsRead}>
            Mark all read
          </Button>
        </Box>

        <Divider />

        <List disablePadding sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              alignItems="flex-start"
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: item.unread ? 'action.hover' : 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ mr: 1.5, mt: 0.5 }}>
                {getIcon(item.type)}
              </Box>

              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={700}>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {item.message}
                    </Typography>
                    <Typography display="block" variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.time}
                    </Typography>
                  </>
                }
              />

              {item.unread && (
                <Chip label="New" size="small" color="primary" sx={{ ml: 1, height: 22 }} />
              )}
            </ListItem>
          ))}
        </List>

        <Divider />

        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing latest notifications
          </Typography>
        </Box>
      </Popover>
    </>
  );
}