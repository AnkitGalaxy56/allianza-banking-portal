export type RequestStatus = 'Pending' | 'Authorised' | 'Rejected';
export type RequestDecision = RequestStatus;

export interface RequestRecord {
  id: string;
  status: RequestStatus;
  submittedOn: string;
  fields: Record<string, string | boolean>;
  displayId?: string;
  canVerify?: boolean;
  canEdit?: boolean;
}

export interface RequestField {
  key: string;
  label: string;
  options?: string[];
}

export interface RequestModuleConfig {
  hideCreateButton?: boolean;
  /** Form keys that must be filled before submitting (defaults to the first two fields). */
  requiredKeys?: string[];
  /** Form keys the server fills in (customer name, status...): shown but not editable. */
  readOnlyKeys?: string[];
  /** Form keys that cannot change once a request exists (the account number). */
  lockedOnEdit?: string[];
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
  fields: Record<string, string | boolean>;
  displayId?: string;
  canVerify?: boolean;
  canEdit?: boolean;
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
