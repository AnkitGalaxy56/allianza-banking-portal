export type RequestDecision = 'Pending' | 'Authorised' | 'Rejected';
export interface ValidationRecord {
  id: string;
  status: RequestDecision;
  submittedOn: string;
  fields: Record<string, string>;
}
export interface ValidationModuleConfig {
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: Array<{ key: string; label: string }>;
  detailFields: Array<{ key: string; label: string }>;
  initialRecords: ValidationRecord[];
  approveLabel?: string;
  rejectLabel?: string;
}
