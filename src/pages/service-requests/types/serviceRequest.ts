export type RequestStatus = 'new' | 'in_review' | 'completed' | 'rejected';
export type RequestType = 'KYC documents' | 'Cheque book' | 'Debit card' | 'Change mail ID' | 'Nomination' | 'Loan enquiry';
export interface ServiceRequest {
  id: string; customer: string; type: RequestType; branch: string; submitted: string;
  status: RequestStatus; note: string; leavesRequested?: number;
}
