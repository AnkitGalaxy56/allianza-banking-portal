import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Standing Instructions',
  description: 'Review standing instruction setup, changes and cancellation requests.',
  searchPlaceholder: 'Search request, customer or account',
  columns: [
    { key: 'branch', label: 'Branch' },
    { key: 'debitAccount', label: 'Debit A/c ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'creditAccount', label: 'Credit A/c ID' },
    { key: 'amount', label: 'Debit amount' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'expiry', label: 'Expiry date' },
  ],
  detailFields: [
    { key: 'branch', label: 'Branch' },
    { key: 'debitAccount', label: 'Debit account ID' },
    { key: 'customer', label: 'Customer name' },
    { key: 'creditAccount', label: 'Credit account ID' },
    { key: 'amount', label: 'Debit amount' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'expiry', label: 'Expiry date' },
    { key: 'instructionType', label: 'Request type' },
    { key: 'nextRun', label: 'Next execution' },
  ],
  initialRecords: [
    { id: 'SI-771', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"branch": "Pune Main", "debitAccount": "XXXX 1290", "customer": "Aarav Sharma", "creditAccount": "XXXX 8812", "amount": "₹8,000", "frequency": "Monthly", "expiry": "28 Oct 2027", "instructionType": "Create", "nextRun": "05 Nov 2026"} },
    { id: 'SI-765', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"branch": "Camp Branch", "debitAccount": "XXXX 2201", "customer": "Meera Joshi", "creditAccount": "XXXX 7710", "amount": "₹2,500", "frequency": "Weekly", "expiry": "27 Apr 2027", "instructionType": "Modify", "nextRun": "02 Nov 2026"} },
    { id: 'SI-752', status: 'Authorised', submittedOn: '25 Oct 2026', fields: {"branch": "Kothrud", "debitAccount": "XXXX 9035", "customer": "Vikram Patil", "creditAccount": "XXXX 1150", "amount": "₹15,000", "frequency": "Monthly", "expiry": "25 Oct 2027", "instructionType": "Create", "nextRun": "01 Nov 2026"} },
  ],
};
