import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StatusPage from './StatusPage';

export default function ForbiddenPage() {
  return (
    <StatusPage
      title="No access"
      message="Your account does not have permission to open this page."
      icon={<LockOutlinedIcon fontSize="large" />}
    />
  );
}
