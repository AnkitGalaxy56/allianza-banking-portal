import { Box } from '@mui/material';
import type { BankTheme } from '@/types/theme';
import defaultBankLogo from '@/assets/default-bank-logo.svg';

interface Props {
  theme: BankTheme;
  size?: number;
  /** White logo tile with the bank logo image; falls back to a theme-coloured bank icon. */
  inverted?: boolean;
}

/**
 * Bank logo tile.
 * - Uses theme.logoUrl when the backend provides a logo.
 * - Falls back to the built-in bank icon when logoUrl is empty/missing.
 * - The fallback icon is coloured with the active bank primary colour.
 */
export default function BrandLogo({ theme, size = 44, inverted = false }: Props) {
  const hasBackendLogo = Boolean(theme.logoUrl?.trim());

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: `${Math.round(size * 0.24)}px`,
        display: 'grid',
        placeItems: 'center',
        bgcolor: inverted ? 'rgba(255,255,255,0.98)' : 'primary.main',
        border: inverted
          ? '2px solid rgba(255,255,255,0.72)'
          : 'none',
        boxShadow: inverted
          ? '0 1px 3px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(255,255,255,0.55)'
          : 'none',
        overflow: 'hidden',
      }}
    >
      {hasBackendLogo ? (
        <Box
          component="img"
          src={theme.logoUrl}
          alt={`${theme.name} logo`}
          onError={(event) => {
            const image = event.currentTarget;
            image.style.display = 'none';
            const fallback = image.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'block';
          }}
          sx={{
            width: '88%',
            height: '88%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : null}

      {/* Default icon: uses the active bank primary colour, so it always matches the theme. */}
      <Box
        aria-hidden="true"
        sx={{
          display: hasBackendLogo ? 'none' : 'block',
          width: '88%',
          height: '88%',
          bgcolor: inverted ? 'primary.main' : '#FFFFFF',
          WebkitMaskImage: `url(${defaultBankLogo})`,
          maskImage: `url(${defaultBankLogo})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    </Box>
  );
}
