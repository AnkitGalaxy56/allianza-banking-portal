import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Opening Accounts',
  description: 'Review fixed deposit and recurring deposit account opening requests.',
  searchPlaceholder: 'Search request, customer or product',
  columns: [
    { key: 'branch', label: 'Branch' },
    { key: 'debitAccount', label: 'Debit A/c ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'deposit', label: 'Deposit amount' },
    { key: 'tenure', label: 'Tenure' },
  ],
  detailFields: [
    { key: 'branch', label: 'Branch' },
    { key: 'debitAccount', label: 'Debit account ID' },
    { key: 'customer', label: 'Customer name' },
    { key: 'product', label: 'Product code' },
    { key: 'deposit', label: 'Deposit amount' },
    { key: 'rate', label: 'Interest rate' },
    { key: 'tenure', label: 'Tenure' },
    { key: 'maturityDate', label: 'Maturity date' },
    { key: 'maturityValue', label: 'Maturity value' },
  ],
  initialRecords: [
    { id: 'OPEN-1031', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"branch": "Pune Main", "debitAccount": "XXXX 1102", "customer": "Aarav Sharma", "product": "FD-12M", "deposit": "₹1,00,000", "rate": "7.1%", "tenure": "12 months", "maturityDate": "28 Oct 2027", "maturityValue": "₹1,07,100"} },
    { id: 'OPEN-1027', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"branch": "Camp Branch", "debitAccount": "XXXX 4431", "customer": "Meera Joshi", "product": "RD-24M", "deposit": "₹5,000/month", "rate": "6.8%", "tenure": "24 months", "maturityDate": "27 Oct 2028", "maturityValue": "₹1,28,000"} },
    { id: 'OPEN-1020', status: 'Authorised', submittedOn: '25 Oct 2026', fields: {"branch": "Kothrud", "debitAccount": "XXXX 2001", "customer": "Vikram Patil", "product": "FD-6M", "deposit": "₹50,000", "rate": "6.5%", "tenure": "6 months", "maturityDate": "25 Apr 2027", "maturityValue": "₹51,625"} },
  ],
};
