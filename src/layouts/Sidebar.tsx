import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { NavLink, useLocation } from 'react-router-dom';

import BrandLogo from '@/components/common/BrandLogo';
import { ROLE_LABELS, ROLES } from '@/config/roles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { selectTheme } from '@/redux/slices/themeSlice';
import { getNavForRole, type NavItem } from '@/routes/navigation';

interface SidebarProps {
  onNavigate?: () => void;
  onToggleSidebar?: () => void;
}

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const isPathActive = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

const hasActiveChild = (item: NavItem, pathname: string): boolean =>
  Boolean(
    item.children?.some(
      (child) =>
        isPathActive(pathname, child.path) || hasActiveChild(child, pathname),
    ),
  );

export default function Sidebar({
  onNavigate,
  onToggleSidebar,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const brand = useAppSelector(selectTheme);
  const { pathname } = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

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
    const selected = isPathActive(pathname, item.path) || childIsActive;
    const expanded = expandedMenus[item.path] ?? childIsActive;
    const submenuId = `submenu-${item.path.replace(/\//g, '-')}`;

    const buttonContent = (
      <>
        <ListItemIcon
          sx={{
            minWidth: nested ? 30 : 36,
            color: 'inherit',
          }}
        >
          <Icon fontSize="small" />
        </ListItemIcon>

        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: selected ? 700 : 600,
            fontSize: nested ? 13 : 14,
          }}
        />

        {hasChildren &&
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
      pl: nested ? 4 : 1.5,
      color: 'text.primary',
      '&.Mui-selected, &.Mui-selected:hover': {
        bgcolor: 'primary.light',
        color: 'primary.dark',
      },
    };

    return (
      <Box key={item.path}>
        {hasChildren ? (
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
        ) : (
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
        )}

        {hasChildren && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
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
              {item.children!.map((child) => renderNavItem(child, true))}
            </List>
          </Collapse>
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
        p: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar header: toggle + bank logo + name */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 0.5,
          pb: 2.5,
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
            <MenuIcon />
          </IconButton>
        )}

        <BrandLogo theme={brand} size={40} />

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
      </Box>

      {/* Role-based navigation with expandable submenus */}
      <List
        disablePadding
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {items.map((item) => renderNavItem(item))}
      </List>

      {/* Logged-in user */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          mt: 1,
          borderRadius: 2,
          bgcolor: 'primary.light',
          minWidth: 0,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 36,
            height: 36,
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials(user.name)}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {user.name}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: 'block' }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      {/* Logout */}
      <Button
        color="inherit"
        startIcon={<LogoutOutlinedIcon />}
        onClick={() => void dispatch(logoutUser())}
        sx={{
          justifyContent: 'flex-start',
          mt: 1,
          fontWeight: 600,
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
