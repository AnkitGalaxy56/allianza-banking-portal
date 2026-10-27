export type LeadStatus = 'new' | 'contacted' | 'closed';
export type LoanProduct = 'Personal loan' | 'Vehicle loan' | 'Home loan';
export interface LeadEnquiry {
  id: string; customer: string; product: LoanProduct; amount: number; tenureMonths: number;
  branch: string; status: LeadStatus; monthlyIncome: number; existingLoans: number;
  eligibleAmount: number; internalNote: string;
}
