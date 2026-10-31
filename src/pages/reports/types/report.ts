export interface RecentReport {
  id: string;
  report: string;
  branch: string;
  period: string;
  generated: string;
  status: 'Ready' | 'Processing' | 'Failed';
}
