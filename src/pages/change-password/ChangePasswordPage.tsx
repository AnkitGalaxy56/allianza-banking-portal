import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PageHeader from '@/components/common/PageHeader';
import FormPasswordField from '@/components/form/FormPasswordField';
import FormOtpField from '@/components/form/FormOtpField';
import FormActions from '@/components/form/FormActions';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { changePasswordService } from '@/services/change-password.service';
import { changePasswordSchema, passwordOtpSchema, type ChangePasswordFormValues, type PasswordOtpFormValues } from './schemas/changePasswordSchema';

type Stage = 'password' | 'otp' | 'success';

export default function ChangePasswordPage() {
  const user = useAppSelector(selectUser);
  const [stage, setStage] = useState<Stage>('password');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' } });
  const otpForm = useForm<PasswordOtpFormValues>({ resolver: zodResolver(passwordOtpSchema), defaultValues: { otp: '' } });

  const requestOtp = async (values: ChangePasswordFormValues) => {
    if (!user) { setError('Your session is unavailable. Please sign in again.'); return; }
    setBusy(true); setError('');
    try {
      const response = await changePasswordService.requestOtp(user, values.oldPassword, values.newPassword);
      setDemoOtp(response.demoOtp ?? '');
      setStage('otp');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start password change.'); }
    finally { setBusy(false); }
  };

  const verifyOtp = async (values: PasswordOtpFormValues) => {
    if (!user) { setError('Your session is unavailable. Please sign in again.'); return; }
    setBusy(true); setError('');
    try {
      await changePasswordService.verifyOtp(user, values.otp);
      setSuccessMessage('Your password has been changed successfully.');
      setStage('success');
      passwordForm.reset(); otpForm.reset();
    } catch (e) { setError(e instanceof Error ? e.message : 'OTP verification failed.'); }
    finally { setBusy(false); }
  };

  const restart = () => { setStage('password'); setError(''); setDemoOtp(''); setSuccessMessage(''); passwordForm.reset(); otpForm.reset(); };

  return (
    <Box>
      <PageHeader title="Change Password" subtitle="Update your password securely using OTP verification." />
      <Paper variant="outlined" sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, sm: 3.5 }, borderRadius: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          {stage === 'success' ? <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 30 }} /> : stage === 'otp' ? <MarkEmailReadOutlinedIcon color="primary" sx={{ fontSize: 30 }} /> : <LockResetOutlinedIcon color="primary" sx={{ fontSize: 30 }} />}
          <Box><Typography variant="h6">{stage === 'password' ? 'Verify your current password' : stage === 'otp' ? 'OTP verification' : 'Password updated'}</Typography><Typography variant="body2" color="text.secondary">{stage === 'password' ? 'Enter your current password and choose a strong new password.' : stage === 'otp' ? 'Enter the six-digit verification code to complete the change.' : 'Your new password is now active.'}</Typography></Box>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {stage === 'password' && <Box component="form" onSubmit={passwordForm.handleSubmit(requestOtp)} noValidate sx={{ mt: 3 }}>
          <Stack spacing={2.25}>
            <FormPasswordField name="oldPassword" control={passwordForm.control} label="Old Password" placeholder="Enter current password" required autoComplete="current-password" />
            <FormPasswordField name="newPassword" control={passwordForm.control} label="New Password" placeholder="Create a new password" required autoComplete="new-password" />
            <FormPasswordField name="confirmPassword" control={passwordForm.control} label="Confirm New Password" placeholder="Re-enter new password" required autoComplete="new-password" />
            <Alert severity="info">Use at least 8 characters with uppercase and lowercase letters, a number, and a special character.</Alert>
            <FormActions showCancel={false} submitLabel="Continue to OTP" saving={busy} />
          </Stack>
        </Box>}
        {stage === 'otp' && <Box component="form" onSubmit={otpForm.handleSubmit(verifyOtp)} noValidate sx={{ mt: 3 }}>
          <Stack spacing={2.5}>
            <Alert severity="info">{demoOtp ? <>A verification code is required to finish changing your password. In local mock mode, use OTP <strong>123456</strong>. No real SMS or email is sent in mock mode.</> : <>Enter the verification code sent to your registered contact method.</>}</Alert>
            {demoOtp && <Alert severity="success">Demo OTP: <strong>{demoOtp}</strong></Alert>}
            <FormOtpField name="otp" control={otpForm.control} length={6} autoFocus />
            <FormActions onCancel={() => { setStage('password'); setError(''); }} cancelLabel="Back" submitLabel="Verify OTP" saving={busy} />
          </Stack>
        </Box>}
        {stage === 'success' && <Stack spacing={2} sx={{ mt: 3 }}>
          <Alert severity="success">{successMessage}</Alert>
          <Typography variant="body2" color="text.secondary">For security, keep your password private and do not reuse it on other websites.</Typography>
          <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={restart} sx={{ alignSelf: 'flex-start' }}>Return to Change Password</Button>
        </Stack>}
      </Paper>
    </Box>
  );
}
