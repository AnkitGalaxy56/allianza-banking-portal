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
import SidebarMenuSearch from '@/components/common/SidebarMenuSearch';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { ROLE_LABELS, ROLES } from '@/config/roles';

const DRAWER_WIDTH = 230;
const COLLAPSED_WIDTH = 76;
const HEADER_HEIGHT = 54;

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
 
  const branchName = user?.branch || 'Bank';
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
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* =========================================
          TOP HEADER - ALWAYS FULL WIDTH
      ========================================= */}

      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          width: '100%',
          position: 'relative',
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 52,
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
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.10)',
                },
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
                xs: 180,
                sm: 250,
                md: 285,
              },
            }}
          >
            <BrandLogo
              theme={brand}
              size={48}
              inverted
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'primary.contrastText',
                  textShadow: '0 0 10px rgba(255,255,255,0.14)',
                }}
              >
                {organizationName}
              </Typography>

              <Typography
                noWrap
                sx={{
                  fontSize: 10.5,
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.2,
                }}
              >
                {branchName}
              </Typography>
            </Box>
          </Box>

          {/* MENU SEARCH - before date and logged-in user */}
          <SidebarMenuSearch
            sx={{
              ml: 'auto',
              width: { xs: 170, sm: 200, md: 220, lg: 235 },
              minWidth: 150,
              flexShrink: 0,
            }}
          />

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
                  fontSize: 10.5,
                  color: 'rgba(255,255,255,0.86)',
                }}
              >
                Date:
              </Typography>

              <Typography
                noWrap
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'primary.contrastText',
                  textShadow: '0 1px 6px rgba(0,0,0,0.22)',
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
                  fontSize: 10.5,
                  color: 'rgba(255,255,255,0.86)',
                }}
              >
                User:
              </Typography>

              <Typography
                noWrap
                title={user?.name || '—'}
                sx={{
                  minWidth: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'primary.contrastText',
                  textShadow: '0 1px 6px rgba(0,0,0,0.22)',
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
                color: 'primary.contrastText',
              },

              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },

              '& .MuiIconButton-root:hover': {
                bgcolor: 'rgba(255,255,255,0.10)',
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
          overflow: 'hidden',
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
            minHeight: 0,
            height: '100%',
            overflow: 'hidden',
            transition: 'width 180ms ease',
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
              height: '100%',
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                height: '100%',
                boxSizing: 'border-box',
                overflowY: 'auto',
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
              height: '100%',
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                height: '100%',
                position: 'relative',
                top: 'auto',
                boxSizing: 'border-box',
                borderRight: 1,
                borderColor: 'divider',
                overflowX: 'hidden',
                overflowY: 'hidden',
                transition: 'width 180ms ease',
              },
            }}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onLogoutClick={handleLogoutClick}
            />
          </Drawer>
        </Box>

        {/* MAIN CONTENT */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
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