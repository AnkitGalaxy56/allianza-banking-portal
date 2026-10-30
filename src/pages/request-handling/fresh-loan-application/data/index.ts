export const moduleConfig = {
  "title": "Lead Generation for Loan Application",
  "formTitle": "Fresh Loan Application Form",
  "tabs": [
    "View"
  ],
  "columns": [
    "Customer No",
    "Mobile No",
    "Email ID",
    "Product Type",
    "Loan Amount",
    "Total Income",
    "Total Expense",
    "Eligibility",
    "Status"
  ],
  "columnKeys": [
    "customerNo",
    "mobileNo",
    "email",
    "productType",
    "loanAmount",
    "totalIncome",
    "totalExpense",
    "eligibility",
    "status"
  ],
  "fields": [
    {
      "key": "customerNo",
      "label": "Customer No",
      "type": "text",
      "required": true
    },
    {
      "key": "customerName",
      "label": "Customer Name",
      "type": "text",
      "required": true
    },
    {
      "key": "mobileNo",
      "label": "Mobile No",
      "type": "tel",
      "required": true
    },
    {
      "key": "email",
      "label": "Email ID",
      "type": "email",
      "required": true
    },
    {
      "key": "productType",
      "label": "Product Type",
      "type": "select",
      "required": true,
      "options": [
        "Home Loan",
        "Personal Loan",
        "Auto Loan"
      ]
    },
    {
      "key": "loanAmount",
      "label": "Requested Loan Amount",
      "type": "number",
      "required": true
    },
    {
      "key": "totalIncome",
      "label": "Total Income",
      "type": "number",
      "required": true
    },
    {
      "key": "totalExpense",
      "label": "Total Expense",
      "type": "number",
      "required": true
    },
    {
      "key": "eligibility",
      "label": "Calculated Loan Eligibility",
      "type": "number",
      "required": false
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "required": true,
      "options": [
        "New",
        "In Review",
        "Approved",
        "Rejected"
      ]
    }
  ],
  "sections": [
    {
      "title": "Customer Details",
      "fields": [
        "customerNo",
        "customerName",
        "mobileNo",
        "email"
      ]
    },
    {
      "title": "Loan Details",
      "fields": [
        "productType",
        "loanAmount",
        "totalIncome",
        "totalExpense",
        "eligibility",
        "status"
      ]
    }
  ],
  "eligibility": true
} as const;
export const sampleRequest = {
  "customerNo": "CUST-1002",
  "customerName": "Meera Joshi",
  "mobileNo": "9876501234",
  "email": "meera@example.com",
  "productType": "Home Loan",
  "loanAmount": "2500000",
  "totalIncome": "125000",
  "totalExpense": "35000",
  "eligibility": "5400000",
  "status": "In Review"
};

export const sampleRequests = [
  sampleRequest,
  { ...sampleRequest, customerNo: 'CUST-1006', customerName: 'Rohan Patil', mobileNo: '9823012345', email: 'rohan.patil@example.com', productType: 'Personal Loan', loanAmount: '600000', totalIncome: '85000', totalExpense: '25000', eligibility: '2160000', status: 'New' },
  { ...sampleRequest, customerNo: 'CUST-1007', customerName: 'Priya Deshmukh', mobileNo: '9890012345', email: 'priya.d@example.com', productType: 'Auto Loan', loanAmount: '950000', totalIncome: '105000', totalExpense: '42000', eligibility: '2268000', status: 'Approved' },
  { ...sampleRequest, customerNo: 'CUST-1008', customerName: 'Kabir Shah', mobileNo: '9765412345', email: 'kabir.shah@example.com', productType: 'Home Loan', loanAmount: '3200000', totalIncome: '145000', totalExpense: '52000', eligibility: '3348000', status: 'Rejected' },
];
