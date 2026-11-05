import { useMemo, useRef, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { getNavForRole, type NavItem } from '@/routes/navigation';

interface Props {
  sx?: Record<string, unknown>;
}

type SearchEntry = {
  label: string;
  path: string;
  icon: NavItem['icon'];
  parent?: string;
};

export default function SidebarMenuSearch({ sx }: Props) {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const entries = useMemo(() => {
    if (!user) return [] as SearchEntry[];
    const result: SearchEntry[] = [];
    const walk = (items: NavItem[], parent?: string) => {
      items.forEach((item) => {
        result.push({ label: item.label, path: item.path, icon: item.icon, parent });
        if (item.children?.length) walk(item.children, item.label);
      });
    };
    walk(getNavForRole(user.role));
    return result;
  }, [user]);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];
    return entries
      .filter((entry) =>
        `${entry.label} ${entry.parent ?? ''}`.toLocaleLowerCase().includes(term),
      )
      .slice(0, 30);
  }, [entries, query]);

  const isOpen = Boolean(anchorEl) && query.trim().length > 0;

  const selectResult = (path: string) => {
    navigate(path);
    setQuery('');
    setAnchorEl(null);
    inputRef.current?.blur();
  };

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box ref={searchContainerRef} sx={{ position: 'relative', ...sx }}>
        <TextField
          fullWidth
          inputRef={inputRef}
          size="small"
          value={query}
          placeholder="Search menus..."
          onChange={(event) => {
            setQuery(event.target.value);
            setAnchorEl(searchContainerRef.current);
          }}
          onFocus={() => {
            if (query.trim()) setAnchorEl(searchContainerRef.current);
          }}
          inputProps={{ 'aria-label': 'Search sidebar menus and submenus', autoComplete: 'off' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <Box
                  component="button"
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('');
                    setAnchorEl(null);
                    inputRef.current?.focus();
                  }}
                  sx={{
                    border: 0, p: 0, width: 22, height: 22, borderRadius: '50%',
                    bgcolor: 'action.hover', color: 'text.secondary', cursor: 'pointer',
                    lineHeight: 1, fontSize: 16, '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  ×
                </Box>
              </InputAdornment>
            ) : undefined,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40,
              borderRadius: 2.5,
              bgcolor: 'background.default',
              fontSize: 13,
              transition: 'box-shadow 150ms ease, background-color 150ms ease',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}18`,
              },
            },
            '& .MuiOutlinedInput-input': { py: 1, px: 0 },
          }}
        />

        <Popper
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'flip', enabled: true },
            { name: 'preventOverflow', options: { boundary: 'viewport', padding: 12 } },
          ]}
          style={{
            zIndex: 1500,
            width: anchorEl ? anchorEl.getBoundingClientRect().width : undefined,
            maxWidth: 'calc(100vw - 24px)',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              maxHeight: 'min(620px, calc(100dvh - 130px))',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 2.5,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 14px 36px rgba(15, 23, 42, 0.16)',
            }}
          >
            <Box sx={{ px: 1.5, py: 1.15, flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: 'text.secondary', textTransform: 'uppercase' }}>
                Menu results
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.2 }}>
                {filtered.length} {filtered.length === 1 ? 'match' : 'matches'} found
              </Typography>
            </Box>

            {filtered.length ? (
              <List
                dense
                disablePadding
                sx={{
                  py: 0.75, px: 0.75, overflowY: 'auto', overscrollBehavior: 'contain',
                  flex: '1 1 auto', minHeight: 0, scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': { width: 5 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 8 },
                }}
              >
                {filtered.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <ListItemButton
                      key={`${entry.path}-${entry.label}`}
                      onClick={() => selectResult(entry.path)}
                      sx={{
                        minHeight: 54, px: 1, py: 0.7, mb: 0.35, borderRadius: 1.75,
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          '& .menu-search-icon': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 38 }}>
                        <Box
                          className="menu-search-icon"
                          sx={{
                            width: 30, height: 30, borderRadius: 1.5, display: 'grid',
                            placeItems: 'center', bgcolor: 'action.hover', color: 'text.secondary',
                            transition: 'all 140ms ease',
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={entry.label}
                        secondary={entry.parent ? `Under ${entry.parent}` : 'Main menu'}
                        primaryTypographyProps={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3, noWrap: true }}
                        secondaryTypographyProps={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.3, noWrap: true }}
                        sx={{ my: 0, minWidth: 0 }}
                      />
                      <ArrowOutwardRoundedIcon sx={{ ml: 0.5, fontSize: 15, color: 'text.disabled' }} />
                    </ListItemButton>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ px: 1.75, py: 2.25 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>No menu found</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.35 }}>
                  Try a different menu or submenu name.
                </Typography>
              </Box>
            )}

            <Box sx={{ flexShrink: 0, px: 1.5, py: 0.8, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
              <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                Showing navigation available to your role
              </Typography>
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
