export const moduleConfig = {
  "title": "Loan EMI Payment Request / EMI Payment",
  "formTitle": "Loan EMI Payment Request Form",
  "tabs": [
    "View",
    "Pending for Authorisation"
  ],
  "columns": [
    "Branch",
    "Debit A/c ID",
    "Name of the Customer (Debit)",
    "Credit A/c ID",
    "Name of the Customer (Credit)",
    "Amount",
    "Status"
  ],
  "columnKeys": [
    "branch",
    "debitAccount",
    "debitName",
    "creditAccount",
    "creditName",
    "debitAmount",
    "status"
  ],
  "fields": [
    {
      "key": "branch",
      "label": "Branch",
      "type": "text",
      "required": true
    },
    {
      "key": "debitAccount",
      "label": "Debit Account ID",
      "type": "text",
      "required": true
    },
    {
      "key": "debitStatus",
      "label": "Debit A/c Status",
      "type": "select",
      "required": true,
      "options": [
        "001 - Entered",
        "002 - Operative",
        "003 - In-Operative",
        "004 - Suspended",
        "005 - Password Blocked"
      ]
    },
    {
      "key": "debitName",
      "label": "Debit Account Name",
      "type": "text",
      "required": true
    },
    {
      "key": "currentBalance",
      "label": "Current Balance",
      "type": "number",
      "required": true
    },
    {
      "key": "debitAmount",
      "label": "Debit Amount",
      "type": "number",
      "required": true
    },
    {
      "key": "creditAccount",
      "label": "Credit Account ID (Loan Account)",
      "type": "text",
      "required": true
    },
    {
      "key": "creditStatus",
      "label": "Credit A/c Status",
      "type": "select",
      "required": true,
      "options": [
        "001 - Entered",
        "002 - Operative",
        "003 - In-Operative",
        "004 - Suspended",
        "005 - Password Blocked"
      ]
    },
    {
      "key": "creditName",
      "label": "Credit Account Name",
      "type": "text",
      "required": true
    },
    {
      "key": "outstanding",
      "label": "Total O/s Amount",
      "type": "number",
      "required": true
    },
    {
      "key": "interestOutstanding",
      "label": "Int. O/s Amt",
      "type": "number",
      "required": true
    },
    {
      "key": "expiryDate",
      "label": "Expiry Date",
      "type": "date",
      "required": true
    },
    {
      "key": "instalmentAmount",
      "label": "Instalment Amount",
      "type": "number",
      "required": true
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "required": true,
      "options": [
        "001 - Entered",
        "002 - Operative",
        "003 - In-Operative",
        "004 - Suspended",
        "005 - Password Blocked"
      ]
    }
  ],
  "sections": [
    {
      "title": "Debit Account Details",
      "fields": [
        "branch",
        "debitAccount",
        "debitStatus",
        "debitName",
        "currentBalance",
        "debitAmount"
      ]
    },
    {
      "title": "Loan / Credit Account Details",
      "fields": [
        "creditAccount",
        "creditStatus",
        "creditName",
        "outstanding",
        "interestOutstanding",
        "expiryDate",
        "instalmentAmount",
        "status"
      ]
    }
  ],
  "notifications": [
    [
      "Insufficient Funds Rejection Message",
      "Dear Customer, Your request has been rejected due to insufficient funds in your account. Kindly maintain sufficient balance and generate the request."
    ],
    [
      "Success Message",
      "Dear Customer, Your request has been accepted and processed immediately. You shall receive the transactional message once your account is debited."
    ]
  ]
} as const;
export const sampleRequest = {
  "branch": "Pune Main",
  "debitAccount": "XXXX 4821",
  "debitStatus": "002 - Operative",
  "debitName": "Aarav Sharma",
  "currentBalance": "45000",
  "debitAmount": "12500",
  "creditAccount": "LN-100245",
  "creditStatus": "002 - Operative",
  "creditName": "Home Loan",
  "outstanding": "850000",
  "interestOutstanding": "6500",
  "expiryDate": "2031-10-01",
  "instalmentAmount": "12500"
};

export const sampleRequests = [
  { ...sampleRequest, status: '002 - Operative' },
  { ...sampleRequest, branch: 'Mumbai Fort', debitAccount: 'XXXX 1942', debitName: 'Meera Joshi', currentBalance: '18000', debitAmount: '8500', creditAccount: 'LN-100318', creditName: 'Personal Loan', outstanding: '245000', interestOutstanding: '2100', expiryDate: '2029-06-15', instalmentAmount: '8500', status: '001 - Entered' },
  { ...sampleRequest, branch: 'Nashik', debitAccount: 'XXXX 8024', debitName: 'Rohan Patil', currentBalance: '9200', debitAmount: '12500', creditAccount: 'LN-100421', creditName: 'Auto Loan', outstanding: '380000', interestOutstanding: '3200', expiryDate: '2028-02-01', instalmentAmount: '12500', status: '004 - Suspended' },
  { ...sampleRequest, branch: 'Pune Main', debitAccount: 'XXXX 6190', debitName: 'Priya Deshmukh', currentBalance: '56000', debitAmount: '14500', creditAccount: 'LN-100522', creditName: 'Home Loan', outstanding: '1250000', interestOutstanding: '7800', expiryDate: '2034-09-01', instalmentAmount: '14500', status: '002 - Operative' },
];
