import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Stop Payment',
  description: 'Review cheque stop-payment and hold requests.',
  searchPlaceholder: 'Search request, customer or cheque number',
  columns: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'Linked account' },
    { key: 'customer', label: 'Customer' },
    { key: 'cheque', label: 'Cheque No.' },
    { key: 'amount', label: 'Cheque amount' },
    { key: 'chequeDate', label: 'Cheque date' },
  ],
  detailFields: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'Linked account ID' },
    { key: 'customer', label: 'Customer name' },
    { key: 'cheque', label: 'Cheque number' },
    { key: 'amount', label: 'Cheque amount' },
    { key: 'chequeDate', label: 'Cheque date' },
    { key: 'issuedTo', label: 'Issued to' },
    { key: 'reason', label: 'Reason for hold' },
  ],
  initialRecords: [
    { id: 'STOP-330', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"branch": "Pune Main", "account": "XXXX 1201", "customer": "Nisha Kulkarni", "cheque": "000184", "amount": "₹18,500", "chequeDate": "25 Oct 2026", "issuedTo": "Kumar Agencies", "reason": "Cheque misplaced"} },
    { id: 'STOP-326', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"branch": "Camp Branch", "account": "XXXX 4410", "customer": "Rohan Deshmukh", "cheque": "000921", "amount": "₹7,250", "chequeDate": "24 Oct 2026", "issuedTo": "S R Traders", "reason": "Payment dispute"} },
    { id: 'STOP-319', status: 'Authorised', submittedOn: '26 Oct 2026', fields: {"branch": "Kothrud", "account": "XXXX 0091", "customer": "Pooja More", "cheque": "000122", "amount": "₹4,000", "chequeDate": "21 Oct 2026", "issuedTo": "A M Services", "reason": "Lost cheque"} },
  ],
};
