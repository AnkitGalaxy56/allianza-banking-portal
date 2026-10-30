export type RequestStatus = 'Pending' | 'Authorised' | 'Rejected';
export interface RequestRecord { id: string; requestStatus: RequestStatus; [key: string]: string | number | boolean; }
