import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Closing Accounts',
  description: 'Review FD / RD account closure and maturity payout requests.',
  searchPlaceholder: 'Search request, customer or account',
  columns: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'Debit A/c ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'deposit', label: 'Deposit amount' },
    { key: 'maturityDate', label: 'Maturity date' },
    { key: 'creditAccount', label: 'Credit A/c ID' },
  ],
  detailFields: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'Debit account ID' },
    { key: 'customer', label: 'Customer name' },
    { key: 'deposit', label: 'Deposit amount' },
    { key: 'maturityDate', label: 'Maturity date' },
    { key: 'maturityValue', label: 'Maturity value' },
    { key: 'creditAccount', label: 'Credit account ID' },
    { key: 'reason', label: 'Closure reason' },
  ],
  initialRecords: [
    { id: 'CLOSE-501', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"branch": "Pune Main", "account": "XXXX 7712", "customer": "Nisha Kulkarni", "deposit": "₹75,000", "maturityDate": "28 Oct 2026", "maturityValue": "₹80,325", "creditAccount": "XXXX 1088", "reason": "Maturity payout"} },
    { id: 'CLOSE-498', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"branch": "Camp Branch", "account": "XXXX 2011", "customer": "Rohan Deshmukh", "deposit": "₹1,50,000", "maturityDate": "30 Oct 2026", "maturityValue": "₹1,62,750", "creditAccount": "XXXX 2290", "reason": "Premature closure request"} },
    { id: 'CLOSE-490', status: 'Rejected', submittedOn: '24 Oct 2026', fields: {"branch": "Kothrud", "account": "XXXX 4490", "customer": "Pooja More", "deposit": "₹30,000", "maturityDate": "20 Dec 2026", "maturityValue": "₹31,950", "creditAccount": "XXXX 1200", "reason": "Account details mismatch"} },
  ],
};
