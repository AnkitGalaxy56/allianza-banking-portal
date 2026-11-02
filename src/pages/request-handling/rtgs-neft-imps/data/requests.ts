import type { RequestModuleConfig } from '../../shared/types';

export const requestsConfig: RequestModuleConfig = {
  title: 'RTGS / NEFT / IMPS Requests',
  description: 'Review payment transfer requests and beneficiary details.',
  searchPlaceholder: 'Search account, customer, beneficiary or request',
  columns: [
    { key: 'branch', label: 'Branch' }, { key: 'account', label: 'A/c No.' },
    { key: 'customer', label: 'Customer Name' }, { key: 'mode', label: 'Trf Mode' },
    { key: 'beneficiaryAccount', label: 'Beneficiary A/c No.' }, { key: 'beneficiary', label: 'Beneficiary Name' },
    { key: 'ifsc', label: 'IFSC Code' }, { key: 'mobile', label: 'Mobile' },
  ],
  detailFields: [
    { key: 'account', label: 'Account No.' }, { key: 'customer', label: 'Account Name' },
    { key: 'accountStatus', label: 'Account Status Code' }, { key: 'currentBalance', label: 'Current Balance' },
    { key: 'mode', label: 'Payment Mode', options: ['NEFT', 'RTGS', 'IMPS'] }, { key: 'beneficiaryAccount', label: 'Beneficiary Account No.' },
    { key: 'beneficiary', label: 'Beneficiary Name' }, { key: 'bank', label: 'Bank Name' },
    { key: 'ifsc', label: 'IFSC Code' }, { key: 'mobile', label: 'Mobile No.' },
    { key: 'amount', label: 'Amount (Rs.)' }, { key: 'remarks', label: 'Remarks' },
  ],
  initialRecords: [
    { id: 'PAY-2401', status: 'Pending', submittedOn: '28 Oct 2026', fields: { branch: 'Pune Main', account: 'XXXX 4821', customer: 'Aarav Sharma', mode: 'NEFT', beneficiaryAccount: 'XXXX 7842', beneficiary: 'Riya Traders', ifsc: 'HDFC0001234', mobile: '98XXXXXX10', accountStatus: '002 - Operative', currentBalance: '₹1,25,000', bank: 'HDFC Bank', amount: '₹45,000', remarks: 'Invoice payment' } },
    { id: 'PAY-2398', status: 'Pending', submittedOn: '27 Oct 2026', fields: { branch: 'Camp Branch', account: 'XXXX 1176', customer: 'Meera Joshi', mode: 'IMPS', beneficiaryAccount: 'XXXX 6201', beneficiary: 'M J Enterprises', ifsc: 'ICIC0000345', mobile: '97XXXXXX11', accountStatus: '002 - Operative', currentBalance: '₹55,000', bank: 'ICICI Bank', amount: '₹12,500', remarks: '' } },
    { id: 'PAY-2391', status: 'Authorised', submittedOn: '26 Oct 2026', fields: { branch: 'Kothrud', account: 'XXXX 9035', customer: 'Vikram Patil', mode: 'RTGS', beneficiaryAccount: 'XXXX 1088', beneficiary: 'VP Supplies', ifsc: 'SBIN0000123', mobile: '99XXXXXX12', accountStatus: '002 - Operative', currentBalance: '₹4,10,000', bank: 'State Bank of India', amount: '₹2,10,000', remarks: 'Supplier payment' } },
  ],
};
