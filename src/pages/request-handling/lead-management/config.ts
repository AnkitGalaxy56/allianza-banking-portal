import type { ValidationModuleConfig } from '../shared/types';

export const config: ValidationModuleConfig = {
  title: 'Lead Management',
  description: 'Review loan leads and customer eligibility information.',
  searchPlaceholder: 'Search lead, customer or mobile',
  columns: [
    { key: 'customerNo', label: 'Customer No.' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email ID' },
    { key: 'product', label: 'Product type' },
    { key: 'amount', label: 'Loan amount' },
    { key: 'income', label: 'Net income' },
    { key: 'eligibility', label: 'Eligible amount' },
  ],
  detailFields: [
    { key: 'customerNo', label: 'Customer number' },
    { key: 'mobile', label: 'Mobile number' },
    { key: 'email', label: 'Email ID' },
    { key: 'product', label: 'Product type' },
    { key: 'amount', label: 'Loan amount' },
    { key: 'income', label: 'Net income' },
    { key: 'emi', label: 'Estimated EMI' },
    { key: 'eligibility', label: 'Eligible amount' },
    { key: 'branch', label: 'Branch' },
  ],
  initialRecords: [
    { id: 'LEAD-811', status: 'Pending', submittedOn: '28 Oct 2026', fields: {"customerNo": "CUST-1021", "mobile": "98XXXXXX10", "email": "aarav@example.com", "product": "Personal Loan", "amount": "₹5,00,000", "income": "₹65,000/month", "emi": "₹12,450", "eligibility": "₹4,20,000", "branch": "Pune Main"} },
    { id: 'LEAD-807', status: 'Pending', submittedOn: '27 Oct 2026', fields: {"customerNo": "CUST-1077", "mobile": "97XXXXXX11", "email": "meera@example.com", "product": "Home Loan", "amount": "₹28,00,000", "income": "₹1,10,000/month", "emi": "₹32,000", "eligibility": "₹24,00,000", "branch": "Camp Branch"} },
    { id: 'LEAD-799', status: 'Authorised', submittedOn: '26 Oct 2026', fields: {"customerNo": "CUST-1009", "mobile": "99XXXXXX12", "email": "vikram@example.com", "product": "Vehicle Loan", "amount": "₹8,00,000", "income": "₹72,000/month", "emi": "₹16,500", "eligibility": "₹6,50,000", "branch": "Kothrud"} },
  ],
};
