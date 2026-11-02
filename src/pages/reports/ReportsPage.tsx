import { Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export default function ReportsPage() {
  return <Navigate to={PATHS.REPORTS.REQUESTS} replace />;
}
