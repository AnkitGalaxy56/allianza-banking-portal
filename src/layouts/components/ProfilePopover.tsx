import { useEffect, useState } from 'react';
import { Avatar, Box, Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { selectUser } from '@/redux/slices/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { profileService } from '@/services/profile.service';
import type { UserProfile } from '@/pages/profile/types/profile';

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const display = (value?: string | null) => value?.trim() || 'Not added';

export default function ProfilePopover() {
  const user = useAppSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    let active = true;
    if (user) profileService.getCurrent(user).then((result) => { if (active) setProfile(result); }).catch(() => { if (active) setProfile(null); });
    return () => { active = false; };
  }, [user]);

  const name = profile?.fullName || user?.name || 'User';
  const email = profile?.email || user?.email || '';

  return (
    <>
      <Tooltip title="Profile">
        <IconButton aria-label="Open profile details" onClick={(event) => setAnchorEl(event.currentTarget)}>
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 330, maxWidth: 'calc(100vw - 24px)', borderRadius: 2, mt: 1 } }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
         
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{initials(name) || <AccountCircleOutlinedIcon />}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700} noWrap>{name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{email}</Typography>
            </Box>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography variant="overline" color="text.secondary">Name</Typography>
          <Typography variant="body2" sx={{ mb: 1.25 }}>{display(name)}</Typography>
          <Typography variant="overline" color="text.secondary">Email</Typography>
          <Typography variant="body2" sx={{ mb: 1.25, overflowWrap: 'anywhere' }}>{display(email)}</Typography>
          <Typography variant="overline" color="text.secondary">Mobile No</Typography>
          <Typography variant="body2">{display(profile?.mobile)}</Typography>
        </Box>
      </Popover>
    </>
  );
}
