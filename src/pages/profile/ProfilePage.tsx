import { useEffect, useMemo, useState } from 'react';
import { Alert, Avatar, Box, Button, Grid, Snackbar, Stack, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/form/FormTextField';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { profileService } from '@/services/profile.service';
import type { UserProfile } from './types/profile';
import { profileSchema, type ProfileFormValues } from './schemas/profileSchema';
import ProfileInfoCard from './components/ProfileInfoCard';
import { displayValue } from './data/profileFields';

export default function ProfilePage() {
  const user = useAppSelector(selectUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema), defaultValues: { email: '', mobile: '' },
  });

  useEffect(() => {
    let active = true;
    if (!user) { setLoading(false); return; }
    profileService.getCurrent(user).then((data) => {
      if (!active) return;
      setProfile(data);
      reset({ email: data.email, mobile: data.mobile });
    }).catch((e: unknown) => {
      if (active) setError(e instanceof Error ? e.message : 'Unable to load profile.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, reset]);

  const initials = (profile?.fullName ?? user?.name ?? 'U').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const roleLabel = profile?.userRole.replace(/_/g, ' ') ?? 'Not added';
  const personalFields = useMemo(() => profile ? [
    { label: 'Full Name', value: displayValue(profile.fullName) },
    { label: 'First Name', value: displayValue(profile.firstName) },
    { label: 'Middle Name', value: displayValue(profile.middleName) },
    { label: 'Last Name', value: displayValue(profile.lastName) },
    { label: 'Mobile Number', value: displayValue(profile.mobile) },
    { label: 'Date of Birth', value: displayValue(profile.dateOfBirth) },
    { label: 'Gender', value: displayValue(profile.gender) },
  ] : [], [profile]);

  const cancelEdit = () => { reset({ email: profile?.email ?? '', mobile: profile?.mobile ?? '' }); setEditing(false); setError(''); };
  const saveProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    setSaving(true); setError('');
    try {
      const updated = await profileService.updateCurrent(user, values);
      setProfile(updated); reset({ email: updated.email, mobile: updated.mobile }); setEditing(false); setNotice('Profile updated successfully.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update profile.'); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <PageHeader title="Profile" subtitle="View your employee details and manage your contact information." actions={!editing ? <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setEditing(true)} disabled={loading || !profile}>Edit Profile</Button> : undefined} />
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {loading && <Alert severity="info" sx={{ mb: 2 }}>Loading profile information…</Alert>}
      {profile && <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', p: 2.25, mb: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5 }}>
          <Stack direction="row" spacing={1.75} alignItems="center">
            <Avatar sx={{ width: 54, height: 54, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 800 }}>{initials}</Avatar>
            <Box><Typography variant="h6">{profile.fullName || user?.name || 'User'}</Typography><Typography variant="body2" color="text.secondary">Employee: {profile.employeeId || 'Not added'}</Typography></Box>
          </Stack>
          <Typography variant="body2" color="text.secondary">Fields available for editing: Email Address and Mobile Number only</Typography>
        </Box>
        {editing && <Box component="form" id="profile-edit-form" onSubmit={handleSubmit(saveProfile)} sx={{ mb: 2, p: 2.5, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Update Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><FormTextField name="email" control={control} label="Email Address" placeholder="name@example.com" type="email" autoComplete="email" required /></Grid>
            <Grid item xs={12} md={6}><FormTextField name="mobile" control={control} label="Mobile Number" placeholder="10-digit mobile number" inputMode="numeric" required maxLength={10} /></Grid>
          </Grid>
          {Object.keys(errors).length > 0 && <Alert severity="warning" sx={{ mt: 2 }}>Please correct the highlighted fields.</Alert>}
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" color="inherit" startIcon={<CloseOutlinedIcon />} onClick={cancelEdit} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
          </Stack>
        </Box>}
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} lg={4}><ProfileInfoCard title="Employee and Personal Information" icon={<PersonOutlineOutlinedIcon />} fields={personalFields} /></Grid>
          <Grid item xs={12} lg={4}><Stack spacing={2}>
            <ProfileInfoCard title="Login Information" icon={<KeyOutlinedIcon />} fields={[
              { label: 'User Name', value: displayValue(profile.userName) },
              { label: 'Email Address', value: displayValue(profile.email) },
              { label: 'Account State', value: displayValue(profile.accountState) },
            ]} />
            <ProfileInfoCard title="Session and Login Settings" icon={<BadgeOutlinedIcon />} fields={[
              { label: 'Permitted Login Time', value: displayValue(profile.permittedLoginTime) },
              { label: 'Permitted Logout Time', value: displayValue(profile.permittedLogoutTime) },
              { label: 'Last Login Date', value: displayValue(profile.lastLoginDate) },
              { label: 'Last Login Time', value: displayValue(profile.lastLoginTime) },
              { label: 'Session Timeout (Seconds)', value: displayValue(profile.sessionTimeoutSeconds) },
            ]} />
          </Stack></Grid>
          <Grid item xs={12} lg={4}><Stack spacing={2}>
            <ProfileInfoCard title="Role and Access Information" icon={<ShieldOutlinedIcon />} fields={[
              { label: 'Designation', value: displayValue(profile.designation) },
              { label: 'User Role', value: roleLabel },
              { label: 'Login Branch', value: displayValue(profile.loginBranch) },
              { label: 'Branch ID', value: displayValue(profile.branchId) },
              { label: 'Allow MultiBranch', value: displayValue(profile.allowMultiBranch) },
              { label: 'Allow Login On Holidays', value: displayValue(profile.allowLoginOnHolidays) },
            ]} />
            <ProfileInfoCard title="Organization Information" icon={<ApartmentOutlinedIcon />} fields={[
              { label: 'Organization Name', value: displayValue(profile.organizationName) },
              { label: 'Organization Code', value: displayValue(profile.organizationCode) },
              { label: 'Employee Number', value: displayValue(profile.employeeId) },
            ]} />
          </Stack></Grid>
        </Grid>
      </>}
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')}><Alert severity="success" onClose={() => setNotice('')} sx={{ width: '100%' }}>{notice}</Alert></Snackbar>
    </Box>
  );
}
