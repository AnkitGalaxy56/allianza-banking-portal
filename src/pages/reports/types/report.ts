export type ReportKind = 'Application Users Report' | 'Requests Report' | 'Transaction Report';
export interface RecentReport { id: string; report: ReportKind; branch: string; period: string; generated: string; status: 'Ready'; }
