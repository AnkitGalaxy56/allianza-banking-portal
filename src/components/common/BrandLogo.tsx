import { Box } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import type { BankTheme } from '@/types/theme';

interface Props {
  theme: BankTheme;
  size?: number;
  /** White tile with coloured icon (for dark backgrounds such as the login panel) */
  inverted?: boolean;
}

/** Bank logo tile. Uses the bank's logoUrl when it has one, otherwise a bank icon. */
export default function BrandLogo({ theme, size = 40, inverted = false }: Props) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: `${Math.round(size * 0.25)}px`,
        display: 'grid',
        placeItems: 'center',
        bgcolor: inverted ? '#FFFFFF' : 'primary.main',
        color: inverted ? 'primary.main' : '#FFFFFF',
      }}
    >
      {theme.logoUrl ? (
        <Box
          component="img"
          src={theme.logoUrl}
          alt={`${theme.name} logo`}
          sx={{ width: '70%', height: '70%', objectFit: 'contain' }}
        />
      ) : (
        <AccountBalanceOutlinedIcon sx={{ fontSize: size * 0.55 }} />
      )}
    </Box>
  );
}
