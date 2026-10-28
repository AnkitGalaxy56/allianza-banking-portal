// import type { ReactNode } from 'react';
// import { Box, Typography } from '@mui/material';

// interface Props {
//   title: string;
//   subtitle?: string;
//   actions?: ReactNode;
// }

// export default function PageHeader({ title, subtitle, actions }: Props) {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         alignItems: 'flex-start',
//         justifyContent: 'space-between',
//         gap: 2,
//         mb: 3,
//       }}
//     >
//       <Box>
//         <Typography variant="h4" component="h1" className="app-page-title">
//           {title}
//         </Typography>
//         {subtitle && (
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//             {subtitle}
//           </Typography>
//         )}
//       </Box>
//       {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>{actions}</Box>}
//     </Box>
//   );
// }
import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Centered Page Title */}
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          className="app-page-title"
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Action Buttons: Bottom Left, Same Row */}
      {actions && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: 1,
            width: '100%',
            marginTop:"40px"
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}