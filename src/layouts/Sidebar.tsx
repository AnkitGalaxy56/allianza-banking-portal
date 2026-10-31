
import { useState } from 'react';

import {
  Box,
  Tooltip,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { NavLink, useLocation } from 'react-router-dom';

import BrandLogo from '@/components/common/BrandLogo';
import { ROLE_LABELS, ROLES } from '@/config/roles';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { getNavForRole, type NavItem } from '@/routes/navigation';

interface SidebarProps {
  onNavigate?: () => void;
  onToggleSidebar?: () => void;
  onLogoutClick?: () => void;
  collapsed?: boolean;
}

const isPathActive = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

const hasActiveChild = (item: NavItem, pathname: string): boolean =>
  Boolean(
    item.children?.some(
      (child) =>
        isPathActive(pathname, child.path) ||
        hasActiveChild(child, pathname),
    ),
  );

export default function Sidebar({
  onNavigate,
  onToggleSidebar,
  onLogoutClick,
  collapsed = false,
}: SidebarProps) {
  const user = useAppSelector(selectUser);
  const brand = useAppSelector(selectTheme);

  const { pathname } = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<
    Record<string, boolean>
  >({});

  if (!user) return null;

  const orgName =
    user.role === ROLES.SUPER_ADMIN ? 'Allianza' : brand.name;

  const items = getNavForRole(user.role);

  const toggleMenu = (path: string, defaultExpanded: boolean) => {
    setExpandedMenus((current) => ({
      ...current,
      [path]: !(current[path] ?? defaultExpanded),
    }));
  };

  const renderNavItem = (item: NavItem, nested = false) => {
    const Icon = item.icon;

    const hasChildren = Boolean(item.children?.length);
    const childIsActive = hasActiveChild(item, pathname);

    const selected =
      isPathActive(pathname, item.path) || childIsActive;

    const expanded = expandedMenus[item.path] ?? childIsActive;

    const submenuId = `submenu-${item.path.replace(/\//g, '-')}`;

    const buttonContent = (
      <>
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 0 : nested ? 30 : 36,
            color: 'inherit',
            justifyContent: 'center',
          }}
        >
          <Icon fontSize="small" />
        </ListItemIcon>

        {!collapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: selected ? 700 : 600,
              fontSize: nested ? 13 : 14,
            }}
          />
        )}

        {!collapsed &&
          hasChildren &&
          (expanded ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          ))}
      </>
    );

    const buttonSx = {
      mb: 0.5,
      width: '100%',
      textAlign: 'left' as const,
      pl: collapsed ? 0 : nested ? 4 : 1.5,
      justifyContent: collapsed ? 'center' : 'flex-start',
      minHeight: 44,
      color: 'text.primary',

      '&.Mui-selected, &.Mui-selected:hover': {
        bgcolor: 'primary.light',
        color: 'primary.dark',
      },
    };

    return (
      <Box key={item.path}>
        {hasChildren ? (
          <Tooltip
            title={collapsed ? item.label : ''}
            placement="right"
            arrow
          >
            <ListItemButton
              component="button"
              type="button"
              selected={selected}
              onClick={() => toggleMenu(item.path, childIsActive)}
              aria-expanded={expanded}
              aria-controls={submenuId}
              className="app-nav-item"
              sx={buttonSx}
            >
              {buttonContent}
            </ListItemButton>
          </Tooltip>
        ) : (
          <Tooltip
            title={collapsed ? item.label : ''}
            placement="right"
            arrow
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              selected={selected}
              onClick={onNavigate}
              className="app-nav-item"
              sx={buttonSx}
            >
              {buttonContent}
            </ListItemButton>
          </Tooltip>
        )}

        {/* Submenu */}
        {hasChildren && expanded && !collapsed && (
          <List
            id={submenuId}
            disablePadding
            sx={{
              pl: 0,
              mb: 0.5,
              borderLeft: 1,
              borderColor: 'divider',
              ml: 2.5,
            }}
          >
            {item.children!.map((child) =>
              renderNavItem(child, true),
            )}
          </List>
        )}
      </Box>
    );
  };

  return (
    <Box
      className="app-sidebar"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        p: collapsed ? 1 : 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: collapsed ? 0 : 0.5,
          pb: 2.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          minWidth: 0,
        }}
      >
        {onToggleSidebar && (
          <IconButton
            size="small"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            onClick={onToggleSidebar}
            sx={{ flexShrink: 0 }}
          >
            {collapsed ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        )}

        <BrandLogo theme={brand} size={40} />

        {!collapsed && (
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={800}
              noWrap
              sx={{ lineHeight: 1.2 }}
            >
              {orgName}
            </Typography>

            <Typography variant="caption" color="text.secondary" noWrap>
              {ROLE_LABELS[user.role]}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Role-based Navigation */}
      <List
        disablePadding
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',

          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(120, 130, 150, 0.5) transparent',

          '&::-webkit-scrollbar': {
            width: '4px',
          },

          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(120, 130, 150, 0.5)',
            borderRadius: '8px',
          },

          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(120, 130, 150, 0.8)',
          },
        }}
      >
        {items.map((item) => renderNavItem(item))}
      </List>

      {/* Bottom Logout */}
      <Tooltip
        title={collapsed ? 'Logout' : ''}
        placement="right"
        arrow
      >
        <Button
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          onClick={onLogoutClick}
          sx={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            minWidth: 0,
            mt: 1,
            fontWeight: 600,
            px: collapsed ? 0 : 2,

            '& .MuiButton-startIcon': {
              mr: collapsed ? 0 : 1,
            },

            '&:hover': {
              bgcolor: 'action.hover',
              color: 'error.main',
            },
          }}
        >
          {!collapsed && 'Logout'}
        </Button>
      </Tooltip>
    </Box>
  );
}
