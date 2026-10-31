export type RequestStatus = 'Pending' | 'Authorised' | 'Rejected';
export type RequestDecision = RequestStatus;

export interface RequestRecord {
  id: string;
  status: RequestStatus;
  submittedOn: string;
  fields: Record<string, string>;
}

export interface RequestField {
  key: string;
  label: string;
}

export interface RequestModuleConfig {
  hideCreateButton?: boolean;
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: RequestField[];
  detailFields: RequestField[];
  initialRecords: RequestRecord[];
}

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
  columns: RequestField[];
  detailFields: RequestField[];
  initialRecords: ValidationRecord[];
  approveLabel?: string;
  rejectLabel?: string;
}
