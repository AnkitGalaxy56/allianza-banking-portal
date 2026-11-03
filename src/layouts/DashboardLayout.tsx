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

import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { Outlet } from 'react-router-dom';

import ProfilePopover from './components/ProfilePopover';
import NotificationsPopover from './components/NotificationsPopover';
import Sidebar from './Sidebar';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import BrandLogo from '@/components/common/BrandLogo';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { ROLE_LABELS, ROLES } from '@/config/roles';

const DRAWER_WIDTH = 230;
const COLLAPSED_WIDTH = 76;
const HEADER_HEIGHT = 76;

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

  const organizationName =
    user?.role === ROLES.SUPER_ADMIN
      ? 'Allianza'
      : user?.bankName || brand.name || 'Bank';

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

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
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* =========================================
          TOP HEADER - ALWAYS FULL WIDTH
      ========================================= */}

      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          width: '100%',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 64,
              md: HEADER_HEIGHT,
            },
            px: {
              xs: 1.5,
              sm: 3,
            },
            gap: 2,
          }}
        >
          {/* Mobile menu button */}

          {/* <IconButton
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{
              display: {
                xs: 'inline-flex',
                md: 'none',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
           */}
          {/* Single hamburger button for desktop and mobile */}
          <Tooltip title="Toggle sidebar">
            <IconButton
              aria-label="Toggle sidebar"
              onClick={() => {
                if (window.innerWidth < 900) {
                  setMobileOpen(true);
                } else {
                  setSidebarCollapsed((previous) => !previous);
                }
              }}
              sx={{
                display: 'inline-flex',
                flexShrink: 0,
                color: 'text.primary',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          {/* BANK BRANDING */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
              flexShrink: 0,
              maxWidth: {
                xs: 150,
                sm: 210,
                md: 230,
              },
            }}
          >
            <BrandLogo
              theme={brand}
              size={40}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.25,
                }}
              >
                {organizationName}
              </Typography>

              <Typography
                noWrap
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  lineHeight: 1.3,
                }}
              >
                {user ? ROLE_LABELS[user.role] : 'Bank'}
              </Typography>
            </Box>
          </Box>

          {/* BRANCH, ROLE AND DESIGNATION */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: {
                xs: 1.5,
                sm: 3,
              },
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Login branch */}

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
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  mt: 0.4,
                }}
              >
                {user?.bankName || brand.name || '—'}
              </Typography>
            </Box>

            {/* User role */}

            <Box
              sx={{
                minWidth: 0,
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
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
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  mt: 0.4,
                }}
              >
                {user ? ROLE_LABELS[user.role] : '—'}
              </Typography>
            </Box>

            {/* Designation */}

            <Box
              sx={{
                minWidth: 0,
                display: {
                  xs: 'none',
                  sm: 'block',
                },
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
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  mt: 0.4,
                }}
              >
                {user ? ROLE_LABELS[user.role] : '—'}
              </Typography>
            </Box>
          </Box>

          {/* DATE AND USER INFORMATION */}

          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              flexDirection: 'column',
              justifyContent: 'center',
              width: 180,
              minWidth: 130,
              flexShrink: 1,
              gap: 0.5,
            }}
          >
            {/* Date */}

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
                }}
              >
                Date:
              </Typography>

              <Typography
                noWrap
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
            </Box>

            {/* Logged-in user */}

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
                }}
              >
                User:
              </Typography>

              <Typography
                noWrap
                title={user?.name || '—'}
                sx={{
                  minWidth: 0,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {user?.name || '—'}
              </Typography>
            </Box>
          </Box>

          {/* PROFILE, NOTIFICATIONS AND LOGOUT */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: {
                xs: 0,
                sm: 1,
              },

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
                  sx={{
                    transform: 'rotate(180deg)',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* =========================================
          BODY - SIDEBAR + MAIN CONTENT
          BOTH START BELOW THE HEADER
      ========================================= */}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          width: '100%',
          alignItems: 'stretch',
        }}
      >
        {/* SIDEBAR CONTAINER */}

        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{
            width: {
              xs: 0,
              md: sidebarWidth,
            },
            flexShrink: 0,
            transition: 'width 180ms ease',
            height: {
              xs: 'auto',
              md: `calc(100vh - ${HEADER_HEIGHT}px)`,
            },
          }}
        >
          {/* MOBILE SIDEBAR */}

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: {
                xs: 'block',
                md: 'none',
              },
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

          {/* DESKTOP SIDEBAR */}

          <Drawer
            variant="permanent"
            open
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                height: '100%',
                position: 'relative',
                top: 'auto',
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
              // onToggleSidebar={() =>
              //   setSidebarCollapsed((value) => !value)
              // }
              onLogoutClick={handleLogoutClick}
            />
          </Drawer>
        </Box>

        {/* MAIN CONTENT */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },
            }}
          >
            <Box
              sx={{
                maxWidth: 1440,
                mx: 'auto',
                minWidth: 0,
              }}
            >
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
      </Box>

      {/* SHARED LOGOUT CONFIRMATION DIALOG */}

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