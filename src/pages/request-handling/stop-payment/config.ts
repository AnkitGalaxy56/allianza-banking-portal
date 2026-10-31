import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Stop Payment Requests',
  description: 'Review cheque stop-payment requests and reasons for hold.',
  searchPlaceholder: 'Search account, customer or cheque number',
  columns: [
    { key: 'branch', label: 'Branch' }, { key: 'debitAccount', label: 'Debit A/c ID' },
    { key: 'customer', label: 'Name of the Customer' }, { key: 'account', label: 'Credit A/c ID' },
    { key: 'creditCustomer', label: 'Name of the Customer' }, { key: 'tenure', label: 'Tenure' },
    { key: 'expiryDate', label: 'Expiry Date' },
  ],
  detailFields: [
    { key: 'cheque', label: 'Cheque No.' }, { key: 'issuedTo', label: 'Issued to' },
    { key: 'amount', label: 'Cheque Amount' }, { key: 'chequeDate', label: 'Cheque Date' },
    { key: 'debitAccount', label: 'Linked Account ID' }, { key: 'accountStatus', label: 'Account Status Code' },
    { key: 'customer', label: 'Name' }, { key: 'reason', label: 'Reason for Hold' },
  ],
  initialRecords: [
    { id: 'STOP-330', status: 'Pending', submittedOn: '28 Oct 2026', fields: { branch: 'Pune Main', debitAccount: 'XXXX 1201', customer: 'Nisha Kulkarni', account: '—', creditCustomer: '—', tenure: '—', expiryDate: '—', cheque: '000184', issuedTo: 'Kumar Agencies', amount: '₹18,500', chequeDate: '25 Oct 2026', accountStatus: '002 - Operative', reason: 'Cheque misplaced' } },
    { id: 'STOP-326', status: 'Pending', submittedOn: '27 Oct 2026', fields: { branch: 'Camp Branch', debitAccount: 'XXXX 4410', customer: 'Rohan Deshmukh', account: '—', creditCustomer: '—', tenure: '—', expiryDate: '—', cheque: '000921', issuedTo: 'S R Traders', amount: '₹7,250', chequeDate: '24 Oct 2026', accountStatus: '002 - Operative', reason: 'Payment dispute' } },
    { id: 'STOP-319', status: 'Authorised', submittedOn: '26 Oct 2026', fields: { branch: 'Kothrud', debitAccount: 'XXXX 0091', customer: 'Pooja More', account: '—', creditCustomer: '—', tenure: '—', expiryDate: '—', cheque: '000122', issuedTo: 'A M Services', amount: '₹4,000', chequeDate: '21 Oct 2026', accountStatus: '002 - Operative', reason: 'Lost cheque' } },
  ],
};
