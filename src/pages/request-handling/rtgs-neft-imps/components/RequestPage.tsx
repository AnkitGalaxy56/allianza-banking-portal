import RequestHandlingPage from '../../shared/RequestHandlingPage';
import { requestsConfig } from '../data/requests';
export default function RequestPage() { return <RequestHandlingPage config={requestsConfig} module="rtgs-neft-imps" />; }
