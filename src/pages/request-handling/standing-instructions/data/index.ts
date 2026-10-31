export const moduleConfig = {
  "title": "Standing Instruction Request",
  "formTitle": "Standing Instructions Request Form",
  "tabs": [
    "View",
    "Pending for Authorisation"
  ],
  "columns": [
    "Branch",
    "Request Date",
    "Debit A/c ID",
    "Name of the Customer (Debit)",
    "Credit A/c ID",
    "Name of the Customer (Credit)",
    "Tenure",
    "Expiry Date",
    "Status"
  ],
  "columnKeys": [
    "branch",
    "requestDate",
    "debitAccount",
    "debitName",
    "creditAccount",
    "creditName",
    "tenure",
    "expiryDate",
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
      "key": "requestDate",
      "label": "Request Date",
      "type": "date",
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
      "key": "debitAmount",
      "label": "Debit Amount",
      "type": "number",
      "required": true
    },
    {
      "key": "tenure",
      "label": "Tenure (mths)",
      "type": "number",
      "required": true
    },
    {
      "key": "frequency",
      "label": "Frequency",
      "type": "select",
      "required": true,
      "options": [
        "Daily",
        "Weekly",
        "Monthly",
        "Quarterly",
        "Half-yearly",
        "Yearly"
      ]
    },
    {
      "key": "expiryDate",
      "label": "Expiry Date",
      "type": "date",
      "required": true
    },
    {
      "key": "creditAccount",
      "label": "Credit Account ID",
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
        "requestDate",
        "debitAccount",
        "debitStatus",
        "debitName",
        "debitAmount",
        "tenure",
        "frequency",
        "expiryDate"
      ]
    },
    {
      "title": "Credit Account Details",
      "fields": [
        "creditAccount",
        "creditStatus",
        "creditName",
        "status"
      ]
    }
  ],
  "notifications": [
    [
      "Rejection / Discrepancy Notification",
      "Dear Customer, Your request has been rejected due to insufficient funds / status discrepancy in your account. Kindly maintain sufficient balance..."
    ],
    [
      "Confirmation Notification",
      "Dear Customer, Your request has been accepted and processed immediately. You shall receive the transactional message once your account is debited."
    ]
  ]
} as const;
export const sampleRequest = {
  "branch": "Pune Main",
  "requestDate": "2026-10-28",
  "debitAccount": "XXXX 4821",
  "debitStatus": "002 - Operative",
  "debitName": "Aarav Sharma",
  "debitAmount": "2500",
  "tenure": "12",
  "frequency": "Monthly",
  "expiryDate": "2027-10-28",
  "creditAccount": "XXXX 7012",
  "creditStatus": "002 - Operative",
  "creditName": "Recurring Deposit"
};

export const sampleRequests = [
  { ...sampleRequest, status: '002 - Operative' },
  { ...sampleRequest, branch: 'Mumbai Fort', requestDate: '2026-10-21', debitAccount: 'XXXX 1942', debitName: 'Meera Joshi', debitAmount: '1800', tenure: '6', frequency: 'Monthly', expiryDate: '2027-04-21', creditAccount: 'XXXX 3320', creditName: 'Education Loan', status: '001 - Entered' },
  { ...sampleRequest, branch: 'Nashik', requestDate: '2026-10-18', debitAccount: 'XXXX 8024', debitName: 'Rohan Patil', debitAmount: '5000', tenure: '24', frequency: 'Quarterly', expiryDate: '2028-10-18', creditAccount: 'XXXX 4419', creditName: 'Recurring Deposit', status: '003 - In-Operative' },
  { ...sampleRequest, branch: 'Pune Main', requestDate: '2026-10-12', debitAccount: 'XXXX 6190', debitName: 'Priya Deshmukh', debitAmount: '3200', tenure: '12', frequency: 'Monthly', expiryDate: '2027-10-12', creditAccount: 'XXXX 5091', creditName: 'Insurance Premium', status: '002 - Operative' },
];
