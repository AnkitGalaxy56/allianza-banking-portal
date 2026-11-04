import { useState, type MouseEvent } from 'react';

import {
  Box,
  Tooltip,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { NavLink, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { getNavForRole, type NavItem } from '@/routes/navigation';

interface SidebarProps {
  onNavigate?: () => void;
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
  onLogoutClick,
  collapsed = false,
}: SidebarProps) {
  const user = useAppSelector(selectUser);
  const { pathname } = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [submenuAnchor, setSubmenuAnchor] = useState<HTMLElement | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);

  if (!user) return null;

  const items = getNavForRole(user.role);

  const closeCollapsedSubmenu = () => {
    setSubmenuAnchor(null);
    setActiveSubmenu(null);
  };

  const handleParentClick = (
    item: NavItem,
    event: MouseEvent<HTMLElement>,
    defaultExpanded: boolean,
  ) => {
    if (collapsed) {
      // In collapsed mode, show the children in a popover beside the icon.
      if (activeSubmenu?.path === item.path && submenuAnchor) {
        closeCollapsedSubmenu();
      } else {
        setSubmenuAnchor(event.currentTarget);
        setActiveSubmenu(item);
      }
      return;
    }

    setExpandedMenus((current) => ({
      ...current,
      [item.path]: !(current[item.path] ?? defaultExpanded),
    }));
  };

  const handleSubmenuNavigation = () => {
    closeCollapsedSubmenu();
    onNavigate?.();
  };

  const renderNavItem = (item: NavItem, nested = false) => {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const childIsActive = hasActiveChild(item, pathname);
    const selected = isPathActive(pathname, item.path) || childIsActive;
    const expanded = expandedMenus[item.path] ?? childIsActive;
    const submenuId = `submenu-${item.path.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

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
      minHeight: 44,
      textAlign: 'left' as const,
      pl: collapsed ? 0 : nested ? 4 : 1.5,
      justifyContent: collapsed ? 'center' : 'flex-start',
      color: 'text.primary',
      borderRadius: 2,
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
              onClick={(event) =>
                handleParentClick(item, event, childIsActive)
              }
              aria-expanded={collapsed ? activeSubmenu?.path === item.path : expanded}
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

        {/* Expanded sidebar: render nested links inline. */}
        {hasChildren && expanded && !collapsed && (
          <List
            id={submenuId}
            disablePadding
            sx={{
              pl: 0,
              mb: 0.5,
              ml: 2.5,
              borderLeft: 1,
              borderColor: 'divider',
            }}
          >
            {item.children!.map((child) => renderNavItem(child, true))}
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
        minHeight: 0,
        width: '100%',
        boxSizing: 'border-box',
        p: collapsed ? 1 : 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Navigation has its own scrollbar; logout stays at the bottom. */}
      <List
        disablePadding
        sx={{
          flex: 1,
          minHeight: 0,
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

      {/* Bottom logout action */}
      <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
        <Button
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          onClick={onLogoutClick}
          sx={{
            flexShrink: 0,
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

      {/* Collapsed sidebar submenu popup */}
      <Popover
        open={collapsed && Boolean(submenuAnchor) && Boolean(activeSubmenu)}
        anchorEl={submenuAnchor}
        onClose={closeCollapsedSubmenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            minWidth: 220,
            maxWidth: 280,
            ml: 0.75,
            py: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 4,
          },
        }}
      >
        {activeSubmenu && (
          <Box>
            <Typography
              sx={{
                px: 2,
                py: 1,
                fontSize: 13,
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              {activeSubmenu.label}
            </Typography>

            <List disablePadding>
              {activeSubmenu.children?.map((child) => {
                const ChildIcon = child.icon;
                const childSelected = isPathActive(pathname, child.path);

                return (
                  <ListItemButton
                    key={child.path}
                    component={NavLink}
                    to={child.path}
                    selected={childSelected}
                    onClick={handleSubmenuNavigation}
                    sx={{
                      minHeight: 42,
                      px: 2,
                      '&.Mui-selected, &.Mui-selected:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 34,
                        color: 'inherit',
                      }}
                    >
                      <ChildIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: childSelected ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        )}
      </Popover>
    </Box>
  );
}
