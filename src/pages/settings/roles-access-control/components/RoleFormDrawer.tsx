import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Checkbox, Divider, Drawer, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AccessRole, ModulePermission, PermissionAction } from '../types/role';
import { PERMISSION_MODULES } from '../data/roleData';
import { roleSchema, type RoleFormValues } from '../schemas/roleSchema';

interface Props { open: boolean; role: AccessRole | null; onClose: () => void; onSave: (role: AccessRole) => void; }
const ACTION_LABELS: Record<PermissionAction, string> = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', approve: 'Approve' };
export default function RoleFormDrawer({ open, role, onClose, onSave }: Props) {
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [permissionError, setPermissionError] = useState('');
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RoleFormValues>({ resolver: zodResolver(roleSchema), defaultValues: { name: '', description: '', status: 'Active' } });
  useEffect(() => {
    reset(role ? { name: role.name, description: role.description, status: role.status } : { name: '', description: '', status: 'Active' });
    setPermissions(role ? role.permissions.map(p => ({ ...p, actions: [...p.actions] })) : []);
    setPermissionError('');
  }, [role, open, reset]);
  const selectedCount = useMemo(() => permissions.reduce((n, p) => n + p.actions.length, 0), [permissions]);
  const hasPermission = (module: string, action: PermissionAction) => !!permissions.find(p => p.module === module)?.actions.includes(action);
  const toggle = (module: string, action: PermissionAction, checked: boolean) => {
    setPermissions(old => {
      const current = old.find(p => p.module === module)?.actions ?? [];
      const actions = checked ? [...new Set([...current, action])] : current.filter(a => a !== action);
      return [...old.filter(p => p.module !== module), ...(actions.length ? [{ module, actions }] : [])];
    });
    setPermissionError('');
  };
  const toggleModule = (module: string, checked: boolean) => {
    const available = PERMISSION_MODULES.find(p => p.module === module)?.actions ?? [];
    setPermissions(old => [...old.filter(p => p.module !== module), ...(checked ? [{ module, actions: [...available] }] : [])]);
    setPermissionError('');
  };
  const selectAll = (checked: boolean) => setPermissions(checked ? PERMISSION_MODULES.map(p => ({ module: p.module, actions: [...p.actions] })) : []);
  const submit = handleSubmit(values => {
    if (!selectedCount) { setPermissionError('Select at least one module permission.'); return; }
    onSave({ id: role?.id ?? `role-${Date.now()}`, ...values, assignedUsers: role?.assignedUsers ?? 0, permissions, systemRole: role?.systemRole ?? false });
  });
  return <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 560, md: 680 }, maxWidth: '100%', display: 'flex' } }}>
    <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="overline" color="text.secondary">ROLE CONFIGURATION</Typography><Typography variant="h5" fontWeight={750}>{role ? 'Edit Role' : 'Add Role'}</Typography></Box><Button onClick={onClose} aria-label="Close drawer" sx={{ minWidth: 40 }}><CloseOutlinedIcon /></Button></Box>
    <Divider />
    <Box id="role-access-form" component="form" onSubmit={submit} sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
      <Stack spacing={2.2}>
        <TextField label="Role Name *" placeholder="e.g. Loan Reviewer" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
        <TextField label="Description *" placeholder="Describe the role's responsibilities" fullWidth multiline minRows={3} {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
        <FormControl fullWidth error={!!errors.status}><InputLabel>Status</InputLabel><Controller name="status" control={control} render={({ field }) => <Select {...field} label="Status"><MenuItem value="Active">Active</MenuItem><MenuItem value="Inactive">Inactive</MenuItem></Select>} />{errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}</FormControl>
      </Stack>
      <Box sx={{ mt: 3, mb: 1 }}><Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}><Box><Typography variant="h6" fontWeight={750}>Module Permissions</Typography><Typography variant="body2" color="text.secondary">Choose the actions permitted for this role.</Typography></Box><Stack direction="row" spacing={1}><Button size="small" onClick={() => selectAll(true)}>Select all</Button><Button size="small" onClick={() => selectAll(false)}>Clear all</Button></Stack></Stack></Box>
      {permissionError && <Alert severity="error" sx={{ mb: 2 }}>{permissionError}</Alert>}
      <Stack spacing={1.25}>{PERMISSION_MODULES.map(item => <Box key={item.module} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><FormControlLabel control={<Checkbox size="small" checked={item.actions.every(a => hasPermission(item.module, a))} indeterminate={item.actions.some(a => hasPermission(item.module, a)) && !item.actions.every(a => hasPermission(item.module, a))} onChange={e => toggleModule(item.module, e.target.checked)} />} label={<Typography fontWeight={700} fontSize={14}>{item.module}</Typography>} /><Typography variant="caption" color="text.secondary">{item.actions.filter(a => hasPermission(item.module, a)).length}/{item.actions.length}</Typography></Stack><Stack direction="row" flexWrap="wrap" sx={{ pl: 3.5, columnGap: 1.5, rowGap: 0 }} spacing={0}>{item.actions.map(action => <FormControlLabel key={action} control={<Checkbox size="small" checked={hasPermission(item.module, action)} onChange={e => toggle(item.module, action, e.target.checked)} />} label={<Typography variant="body2" color="text.secondary">{ACTION_LABELS[action]}</Typography>} />)}</Stack></Box>)}</Stack>
    </Box>
    <Divider /><Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2.5, position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}><Button variant="outlined" onClick={onClose}>Cancel</Button><Button type="submit" form="role-access-form" variant="contained" startIcon={<CheckOutlinedIcon />} disabled={isSubmitting}>{role ? 'Save Changes' : 'Create Role'}</Button></Stack>
  </Drawer>;
}
