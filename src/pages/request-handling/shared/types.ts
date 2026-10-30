export type RequestStatus = 'Pending' | 'Authorised' | 'Rejected';
export interface RequestRecord { id: string; status: RequestStatus; submittedOn: string; fields: Record<string, string>; }
export interface RequestField { key: string; label: string; }
export interface RequestModuleConfig { title: string; description: string; searchPlaceholder: string; columns: RequestField[]; detailFields: RequestField[]; initialRecords: RequestRecord[]; }
