// import { useState } from 'react';
// import {
//   Alert,
//   Box,
//   Button,
//   Paper,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import {
//   clearAuthError,
//   selectAuth,
//   verifyMockOtp,
// } from '@/redux/slices/authSlice';
// import { PATHS } from '@/routes/paths';

// export default function OtpVerificationPage() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { otpPending, status, error } = useAppSelector(selectAuth);
//   const [otp, setOtp] = useState('');
//   const [notice, setNotice] = useState('');

//   if (!otpPending) {
//     return <Navigate to={PATHS.login} replace />;
//   }

//   const handleVerify = async () => {
//     try {
//       await dispatch(verifyMockOtp({ otp })).unwrap();
//       navigate(PATHS.dashboard, { replace: true });
//     } catch {
//       // Error is displayed from Redux.
//     }
//   };

//   const handleBackToLogin = () => {
//     dispatch(clearAuthError());
//     navigate(PATHS.login, { replace: true });
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'grid',
//         placeItems: 'center',
//         bgcolor: 'background.default',
//         p: 2,
//       }}
//     >
//       <Paper
//         variant="outlined"
//         sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 }, borderRadius: 3 }}
//       >
//         <Typography variant="h5" fontWeight={800} mb={1}>
//           Verify OTP
//         </Typography>

//         <Typography color="text.secondary" variant="body2" mb={3}>
//           Enter the one-time password to continue to your dashboard.
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {notice && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             {notice}
//           </Alert>
//         )}

//         <TextField
//           fullWidth
//           label="6-digit OTP"
//           value={otp}
//           onChange={(event) => {
//             setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
//             if (error) dispatch(clearAuthError());
//           }}
//           inputProps={{
//             inputMode: 'numeric',
//             maxLength: 6,
//             'aria-label': '6-digit OTP',
//           }}
//           onKeyDown={(event) => {
//             if (event.key === 'Enter' && otp.length === 6) {
//               void handleVerify();
//             }
//           }}
//           autoFocus
//           sx={{ mb: 2 }}
//         />

//         <Button
//           fullWidth
//           variant="contained"
//           size="large"
//           disabled={otp.length !== 6 || status === 'loading'}
//           onClick={() => void handleVerify()}
//         >
//           {status === 'loading' ? 'Verifying…' : 'Verify OTP'}
//         </Button>

//         <Button
//           fullWidth
//           sx={{ mt: 1 }}
//           disabled={status === 'loading'}
//           onClick={() => {
//             setOtp('');
//             setNotice('For mock testing, enter OTP 123456.');
//             dispatch(clearAuthError());
//           }}
//         >
//           Resend OTP
//         </Button>

//         <Button
//           fullWidth
//           color="inherit"
//           sx={{ mt: 1 }}
//           disabled={status === 'loading'}
//           onClick={handleBackToLogin}
//         >
//           Back to Login
//         </Button>
//       </Paper>
//     </Box>
//   );
// }



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

import BrandLogo from '@/components/common/BrandLogo';
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
  const brand = useAppSelector((state) => state.theme.theme);

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

  const handleResendOtp = () => {
    setOtp('');
    setNotice('For mock testing, enter OTP 123456.');
    dispatch(clearAuthError());
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      {/* Left: Bank branding panel — matches LoginPage */}
      <Box
        className="login-panel"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 6,
          color: '#FFFFFF',
          textAlign: 'center',
          bgcolor: 'var(--brand-auth-panel)',
        }}
      >
        <BrandLogo theme={brand} size={88} inverted />

        <Box>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: 800 }}
          >
            {brand.name}
          </Typography>

          {brand.tagline && (
            <Typography sx={{ mt: 1, opacity: 0.75 }}>
              {brand.tagline}
            </Typography>
          )}
        </Box>

        {/* Developed by footer */}
        <Box
          sx={{
            width: '100%',
            mt: 'auto',
            pt: 4,
            pb: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              width: '100%',
              maxWidth: 280,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: '1px',
                bgcolor: 'rgba(255,255,255,0.45)',
              }}
            />

            <Typography
              variant="caption"
              sx={{ color: '#FFFFFF', whiteSpace: 'nowrap' }}
            >
              Developed by
            </Typography>

            <Box
              sx={{
                flex: 1,
                height: '1px',
                bgcolor: 'rgba(255,255,255,0.45)',
              }}
            />
          </Box>

          <Box
            component="img"
            src="/images/allianza-logo.png"
            alt="Allianza Infoway"
            sx={{
              width: 170,
              maxWidth: '80%',
              height: 48,
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              mt: -0.5,
            }}
          >
            infoway pvt. ltd.
          </Typography>
        </Box>
      </Box>

      {/* Right: OTP verification card */}
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Paper
          className="login-card"
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(15,27,45,0.08)',
          }}
        >
          {/* Mobile branding — matches LoginPage */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
            }}
          >
            <BrandLogo theme={brand} size={40} />

            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {brand.name}
              </Typography>

              {brand.tagline && (
                <Typography variant="caption" color="text.secondary">
                  {brand.tagline}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography
            variant="caption"
            fontWeight={800}
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            TWO-FACTOR AUTHENTICATION
          </Typography>

          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 0.5 }}
          >
            Verify OTP
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Enter the one-time password to verify your identity and
            continue to your dashboard.
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

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();

              if (otp.length === 6 && status !== 'loading') {
                void handleVerify();
              }
            }}
            noValidate
          >
            <TextField
              fullWidth
              label="6-digit OTP"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(event) => {
                setOtp(
                  event.target.value.replace(/\D/g, '').slice(0, 6),
                );

                if (error) {
                  dispatch(clearAuthError());
                }
              }}
              inputProps={{
                inputMode: 'numeric',
                maxLength: 6,
                'aria-label': '6-digit OTP',
              }}
              autoComplete="one-time-code"
              autoFocus
              disabled={status === 'loading'}
              sx={{ mb: 2.5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={otp.length !== 6 || status === 'loading'}
            >
              {status === 'loading' ? 'Verifying…' : 'Verify OTP'}
            </Button>
          </Box>

          <Button
            fullWidth
            sx={{ mt: 1.5 }}
            disabled={status === 'loading'}
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>

          <Button
            fullWidth
            color="inherit"
            sx={{ mt: 0.5 }}
            disabled={status === 'loading'}
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}