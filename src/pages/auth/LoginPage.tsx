import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import DevCredentialsHint from '@/components/auth/DevCredentialsHint';
import BrandLogo from '@/components/common/BrandLogo';
import FormTextField from '@/components/form/FormTextField';
import type { PortalType } from '@/types/auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAuthError, login, selectAuth } from '@/redux/slices/authSlice';
import { loadBankTheme, setPlatformTheme } from '@/redux/slices/themeSlice';
import { resolveBankCode } from '@/utils/bank';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';


const loginSchema = z.object({
  loginId: z.string().trim().min(1, 'Enter your login ID'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectAuth);
  const brand = useAppSelector((state) => state.theme.theme);
  const themeStatus = useAppSelector((state) => state.theme.status);
  const themeError = useAppSelector((state) => state.theme.error);

  const bankCode = useMemo(() => resolveBankCode(), []);
  // Portal mode is determined ONLY by the URL. The user's backend role is loaded later from /auth/profile.
  const portalType: PortalType = bankCode ? 'BANK' : 'ALLIANZA';
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const needsBank = Boolean(bankCode);
  const bankThemeFailed = needsBank && themeStatus === 'failed';
  const submitting = status === 'loading';

  const { control, handleSubmit, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: '', password: '', remember: false },
  });

  // Brand the page: direct /login uses Allianza; /login?bank=<code> loads that bank theme.
  useEffect(() => {
    if (bankCode) {
      void dispatch(loadBankTheme(bankCode));
    } else {
      dispatch(setPlatformTheme());
    }
  }, [bankCode, dispatch]);

  // const onSubmit = (values: LoginFormValues) => {
  //   setNotice(null);
  //   void dispatch(
  //     login({
  //       loginId: values.loginId.trim(),
  //       password: values.password,
  //       role,
  //       bankCode: needsBank ? bankCode ?? undefined : undefined,
  //       remember: values.remember,
  //     }),
  //   );
  // };
  const onSubmit = async (values: LoginFormValues) => {
    setNotice(null);

    try {
      await dispatch(
        login({
          loginId: values.loginId.trim(),
          password: values.password,
          portalType,
          bankCode: needsBank ? bankCode ?? undefined : undefined,
          remember: values.remember,
        }),
      ).unwrap();

      navigate(PATHS.otp, { replace: true });
    } catch {
      // The existing Redux error alert displays the login error.
    }
  };
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      {/* Left: brand panel */}
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
          <Typography variant="h4" component="div" sx={{ fontWeight: 800 }}>
            {brand.name}
          </Typography>
          {brand.tagline && (
            <Typography sx={{ mt: 1, opacity: 0.75 }}>{brand.tagline}</Typography>
          )}
        </Box>

        {/* Developed by footer */}
        <Box
          sx={{
            mt: 'auto',
            pt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >



          {/* Developed by footer */}
          <Box
            sx={{
              width: '100%',
              mt: 'auto',
              pt: 1,
              pb: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 0.5,
            }}
          >
            {/* Developed by with divider lines */}
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
                sx={{
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
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

            {/* Allianza logo */}
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

            {/* Company tagline */}
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

      </Box>

      {/* Right: sign-in card */}
      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 }, bgcolor: 'background.default' }}>
        <Paper
          className="login-card"
          variant="outlined"
          sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: '0 10px 30px rgba(15,27,45,0.08)' }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
            <BrandLogo theme={brand} size={40} />
            <Typography variant="subtitle1">{brand.name}</Typography>
          </Box>

          {bankThemeFailed ? (
            <Box sx={{ py: 3 }}>
              <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
                Bank portal unavailable
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The requested bank portal could not be found. No login is available for this URL.
              </Typography>
              <Alert severity="error">
                {themeError ?? `Theme not found: ${bankCode}`}
              </Alert>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => navigate(PATHS.login, { replace: true })}
              >
                Go to Allianza Login
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {portalType === 'ALLIANZA'
                  ? 'Enter your login ID and password to manage the Allianza platform.'
                  : `Enter your login ID and password to manage ${brand.name}.`}
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
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                onChange={() => error && dispatch(clearAuthError())}
                sx={{ display: 'grid', gap: 2.5 }}
              >
                <FormTextField<LoginFormValues>
                  name="loginId"
                  control={control}
                  label="Login ID"
                  placeholder="Enter your login ID"
                  autoComplete="username"
                  disabled={submitting}
                  autoFocus
                />
                <FormTextField<LoginFormValues>
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={submitting}
                  endAdornment={
                    <Button
                      size="small"
                      onClick={() => setShowPassword((s) => !s)}
                      sx={{ minWidth: 0, fontWeight: 700 }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  }
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={<Typography variant="body2">Remember this device</Typography>}
                        control={
                          <Checkbox
                            size="small"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                      />
                    )}
                  />
                  <Link
                    component="button"
                    type="button"
                    underline="hover"
                    variant="body2"
                    fontWeight={700}
                    onClick={() => setNotice('Password reset will be available once the backend API is connected.')}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </Box>

              <DevCredentialsHint
                portalType={portalType}
                bankCode={bankCode}
                onUse={(c) => {
                  setValue('loginId', c.loginId, { shouldValidate: true });
                  setValue('password', c.password, { shouldValidate: true });
                }}
              />
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
