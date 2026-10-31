import { Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
export default function RequestValidationIndex() {
  return <Navigate to={PATHS.requestValidationPayments} replace />;
}
