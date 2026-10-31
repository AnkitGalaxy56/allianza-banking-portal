import RequestQueuePage from '../shared/RequestQueuePage';
import { config } from './config';

export default function StopPaymentPage() {
  return <RequestQueuePage config={config} />;
}
