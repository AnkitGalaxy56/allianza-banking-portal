import { Suspense, useState } from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ProfilePopover from './components/ProfilePopover';
import NotificationsPopover from './components/NotificationsPopover';
import CircularProgress from '@mui/material/CircularProgress';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { ROLE_LABELS } from '@/config/roles';
import Sidebar from './Sidebar';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const DRAWER_WIDTH = 230;
const COLLAPSED_WIDTH = 76;

/** Signed-in shell. Brand stays in the sidebar; the top bar belongs to the content area. */
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const brand = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="nav" aria-label="Main navigation" sx={{ width: { xs: 0, md: sidebarWidth }, flexShrink: { md: 0 }, transition: 'width 180ms ease' }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              overflowX: 'hidden',
              transition: 'width 180ms ease',
            },
          }}
        >
          <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />
        </Drawer>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer - 1 }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, md: 76 }, px: { xs: 1.5, sm: 3 }, gap: 2 }}>
            <IconButton aria-label="Open navigation" onClick={() => setMobileOpen(true)} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 4 }, flex: 1, minWidth: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>LOGIN BRANCH</Typography>
                <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}>{user?.bankName || brand.name || '—'}</Typography>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>USER ROLE</Typography>
                <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}>{user ? ROLE_LABELS[user.role] : '—'}</Typography>
              </Box>
              <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>DESIGNATION</Typography>
                <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}>{user ? ROLE_LABELS[user.role] : '—'}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                width: 180,
                minWidth: 130,
                flexShrink: 1,
                ml: -1.5,
                mr: 0.5,
                gap: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, whiteSpace: 'nowrap' }}>
                <Typography sx={{ flexShrink: 0, fontSize: 12, color: 'text.secondary', lineHeight: 1.25 }}>Date:</Typography>
                <Typography
                  title={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}
                >
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, whiteSpace: 'nowrap' }}>
                <Typography sx={{ flexShrink: 0, fontSize: 12, color: 'text.secondary', lineHeight: 1.25 }}>User:</Typography>
                <Typography
                  title={user?.name || '—'}
                  sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}
                >
                  {user?.name || '—'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1 } }}>
              <ProfilePopover />
              <NotificationsPopover />
              <Tooltip title="Logout"><IconButton aria-label="Logout" onClick={() => void dispatch(logoutUser())}><LogoutOutlinedIcon sx={{ transform: 'rotate(180deg)' }} /></IconButton></Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 1440, mx: 'auto', minWidth: 0 }}>
            <Suspense fallback={<Box role="status" aria-label="Loading page" sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={28} /></Box>}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
