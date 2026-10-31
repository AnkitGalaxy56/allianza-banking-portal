
import { Suspense, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';

import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { Outlet } from 'react-router-dom';

import ProfilePopover from './components/ProfilePopover';
import NotificationsPopover from './components/NotificationsPopover';
import Sidebar from './Sidebar';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { ROLE_LABELS } from '@/config/roles';

const DRAWER_WIDTH = 230;
const COLLAPSED_WIDTH = 76;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const brand = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const sidebarWidth = sidebarCollapsed
    ? COLLAPSED_WIDTH
    : DRAWER_WIDTH;

  // Called from both topbar and sidebar logout buttons
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  // Execute logout only after confirmation
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    void dispatch(logoutUser());
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          width: { xs: 0, md: sidebarWidth },
          flexShrink: { md: 0 },
          transition: 'width 180ms ease',
        }}
      >
        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Sidebar
            onNavigate={() => setMobileOpen(false)}
            onLogoutClick={handleLogoutClick}
          />
        </Drawer>

        {/* Desktop Sidebar */}
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
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleSidebar={() =>
              setSidebarCollapsed((value) => !value)
            }
            onLogoutClick={handleLogoutClick}
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Topbar */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: { xs: 64, md: 76 },
              px: { xs: 1.5, sm: 3 },
              gap: 2,
            }}
          >
            <IconButton
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 4 },
                flex: 1,
                minWidth: 0,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    lineHeight: 1.3,
                  }}
                >
                  LOGIN BRANCH
                </Typography>

                <Typography
                  noWrap
                  sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}
                >
                  {user?.bankName || brand.name || '—'}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    lineHeight: 1.3,
                  }}
                >
                  USER ROLE
                </Typography>

                <Typography
                  noWrap
                  sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}
                >
                  {user ? ROLE_LABELS[user.role] : '—'}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    lineHeight: 1.3,
                  }}
                >
                  DESIGNATION
                </Typography>

                <Typography
                  noWrap
                  sx={{ fontSize: 14, fontWeight: 700, mt: 0.4 }}
                >
                  {user ? ROLE_LABELS[user.role] : '—'}
                </Typography>
              </Box>
            </Box>

            {/* Date and User */}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    fontSize: 12,
                    color: 'text.secondary',
                    lineHeight: 1.25,
                  }}
                >
                  Date:
                </Typography>

                <Typography
                  title={new Date().toLocaleDateString('en-IN')}
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    fontSize: 12,
                    color: 'text.secondary',
                    lineHeight: 1.25,
                  }}
                >
                  User:
                </Typography>

                <Typography
                  title={user?.name || '—'}
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {user?.name || '—'}
                </Typography>
              </Box>
            </Box>

            {/* Topbar Actions */}
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0, sm: 1 },
              }}
            >
              <ProfilePopover />
              <NotificationsPopover />

              <Tooltip title="Logout">
                <IconButton
                  aria-label="Logout"
                  onClick={handleLogoutClick}
                  color="inherit"
                >
                  <LogoutOutlinedIcon
                    sx={{ transform: 'rotate(180deg)' }}
                  />
                </IconButton>
              </Tooltip>
            </Box> */}
            {/* Topbar Actions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0, sm: 1 },

                // Apply same color to Profile, Notification and Logout
                '& .MuiIconButton-root': {
                  color: 'text.primary',
                },

                '& .MuiSvgIcon-root': {
                  color: 'inherit',
                },

                '& .MuiIconButton-root:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ProfilePopover />

              <NotificationsPopover />

              <Tooltip title="Logout">
                <IconButton
                  aria-label="Logout"
                  onClick={handleLogoutClick}
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  <LogoutOutlinedIcon
                    sx={{ transform: 'rotate(180deg)' }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ maxWidth: 1440, mx: 'auto', minWidth: 0 }}>
            <Suspense
              fallback={
                <Box
                  role="status"
                  aria-label="Loading page"
                  sx={{
                    minHeight: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>

      {/* Shared Logout Confirmation Dialog */}
      <ConfirmDialog
        open={logoutDialogOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </Box>
  );
}
