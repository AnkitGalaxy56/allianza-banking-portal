import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  clearAuthError,
  selectAuth,
  verifyMockOtp,
} from '@/redux/slices/authSlice';
import { PATHS } from '@/routes/paths';

export default function OtpVerificationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { otpPending, status, error } = useAppSelector(selectAuth);
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState('');

  if (!otpPending) {
    return <Navigate to={PATHS.login} replace />;
  }

  const handleVerify = async () => {
    try {
      await dispatch(verifyMockOtp({ otp })).unwrap();
      navigate(PATHS.dashboard, { replace: true });
    } catch {
      // Error is displayed from Redux.
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearAuthError());
    navigate(PATHS.login, { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 }, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight={800} mb={1}>
          Verify OTP
        </Typography>

        <Typography color="text.secondary" variant="body2" mb={3}>
          Enter the one-time password to continue to your dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}

        <TextField
          fullWidth
          label="6-digit OTP"
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
            if (error) dispatch(clearAuthError());
          }}
          inputProps={{
            inputMode: 'numeric',
            maxLength: 6,
            'aria-label': '6-digit OTP',
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && otp.length === 6) {
              void handleVerify();
            }
          }}
          autoFocus
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={otp.length !== 6 || status === 'loading'}
          onClick={() => void handleVerify()}
        >
          {status === 'loading' ? 'Verifying…' : 'Verify OTP'}
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          disabled={status === 'loading'}
          onClick={() => {
            setOtp('');
            setNotice('For mock testing, enter OTP 123456.');
            dispatch(clearAuthError());
          }}
        >
          Resend OTP
        </Button>

        <Button
          fullWidth
          color="inherit"
          sx={{ mt: 1 }}
          disabled={status === 'loading'}
          onClick={handleBackToLogin}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
}