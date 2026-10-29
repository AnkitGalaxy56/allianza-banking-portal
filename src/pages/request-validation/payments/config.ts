import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Payments',
  description: 'Review RTGS / NEFT / IMPS and other payment requests.',
  searchPlaceholder: 'Search request, account or customer',
  columns: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'A/c No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'mode', label: 'Transfer mode' },
    { key: 'amount', label: 'Amount' },
    { key: 'beneficiary', label: 'Beneficiary' },
  ],
  detailFields: [
    { key: 'branch', label: 'Branch' },
    { key: 'account', label: 'Debit account' },
    { key: 'customer', label: 'Customer name' },
    { key: 'mode', label: 'Transfer mode' },
    { key: 'amount', label: 'Amount (Rs.)' },
    { key: 'beneficiary', label: 'Beneficiary details' },
    { key: 'ifsc', label: 'Beneficiary IFSC' },
    { key: 'mobile', label: 'Mobile number' },
  ],
  initialRecords: [
    { id: 'PAY-2401', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"branch": "Pune Main", "account": "XXXX 4821", "customer": "Aarav Sharma", "mode": "NEFT", "amount": "₹45,000", "beneficiary": "Riya Traders", "ifsc": "HDFC0001234", "mobile": "98XXXXXX10"} },
    { id: 'PAY-2398', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"branch": "Camp Branch", "account": "XXXX 1176", "customer": "Meera Joshi", "mode": "IMPS", "amount": "₹12,500", "beneficiary": "M J Enterprises", "ifsc": "ICIC0000345", "mobile": "97XXXXXX11"} },
    { id: 'PAY-2391', status: 'Authorised', submittedOn: '26 Oct 2026', fields: {"branch": "Kothrud", "account": "XXXX 9035", "customer": "Vikram Patil", "mode": "RTGS", "amount": "₹2,10,000", "beneficiary": "VP Supplies", "ifsc": "SBIN0000123", "mobile": "99XXXXXX12"} },
  ],
};
