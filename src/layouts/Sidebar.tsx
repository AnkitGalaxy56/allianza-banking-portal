import { Avatar, Box, Button, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NavLink, useLocation } from 'react-router-dom';
import BrandLogo from '@/components/common/BrandLogo';
import { ROLE_LABELS, ROLES } from '@/config/roles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { getNavForRole } from '@/routes/navigation';

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const brand = useAppSelector(selectTheme);
  const { pathname } = useLocation();

  if (!user) return null;

  const orgName = user.role === ROLES.SUPER_ADMIN ? 'Allianza' : brand.name;
  const items = getNavForRole(user.role);

  return (
    <Box
      className="app-sidebar"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.paper' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, pb: 2.5 }}>
        <BrandLogo theme={brand} size={40} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            {orgName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ROLE_LABELS[user.role]}
          </Typography>
        </Box>
      </Box>

      <List disablePadding sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const selected = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={selected}
              onClick={onNavigate}
              className="app-nav-item"
              sx={{
                mb: 0.5,
                color: 'text.primary',
                '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'primary.light', color: 'primary.dark' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, mt: 1, borderRadius: 2, bgcolor: 'primary.light' }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
          {initials(user.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Button
        color="inherit"
        startIcon={<LogoutOutlinedIcon />}
        onClick={() => void dispatch(logoutUser())}
        sx={{ justifyContent: 'flex-start', mt: 1, fontWeight: 600 }}
      >
        Logout
      </Button>
    </Box>
  );
}
