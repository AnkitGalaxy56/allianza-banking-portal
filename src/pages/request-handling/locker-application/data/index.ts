export const moduleConfig = {
  "title": "Locker Application Register",
  "formTitle": "Locker Application Form",
  "tabs": [
    "View",
    "Pending for Authorisation"
  ],
  "columns": [
    "Customer No",
    "Customer Name",
    "Mobile No",
    "Email ID",
    "Operation for",
    "Status"
  ],
  "columnKeys": [
    "customerNo",
    "customerName",
    "mobileNo",
    "email",
    "operationMode",
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
      "key": "branch",
      "label": "Locker Branch / Location",
      "type": "select",
      "required": true,
      "options": [
        "Pune Main Branch",
        "Mumbai Fort Branch",
        "Nashik Branch"
      ]
    },
    {
      "key": "lockerType",
      "label": "Locker Size / Type",
      "type": "select",
      "required": true,
      "options": [
        "Small",
        "Medium",
        "Large"
      ]
    },
    {
      "key": "operationMode",
      "label": "Operation Mode",
      "type": "select",
      "required": true,
      "options": [
        "Single",
        "Joint",
        "Either or Survivor"
      ]
    },
    {
      "key": "nomineeName",
      "label": "Nominee Name",
      "type": "text",
      "required": false
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
      "title": "Customer Details",
      "fields": [
        "customerNo",
        "customerName",
        "mobileNo",
        "email",
        "branch",
        "lockerType",
        "operationMode",
        "nomineeName",
        "status"
      ]
    }
  ]
} as const;
export const sampleRequest = {
  "customerNo": "CUST-1001",
  "customerName": "Aarav Sharma",
  "mobileNo": "9876543210",
  "email": "aarav@example.com",
  "branch": "Pune Main Branch",
  "lockerType": "Medium",
  "operationMode": "Joint",
  "nomineeName": "Meera Sharma"
};

export const sampleRequests = [
  { ...sampleRequest, status: '002 - Operative' },
  { ...sampleRequest, customerNo: 'CUST-1003', customerName: 'Rohan Patil', mobileNo: '9823012345', email: 'rohan.patil@example.com', branch: 'Mumbai Fort Branch', lockerType: 'Small', operationMode: 'Single', nomineeName: 'Anita Patil', status: '001 - Entered' },
  { ...sampleRequest, customerNo: 'CUST-1004', customerName: 'Priya Deshmukh', mobileNo: '9890012345', email: 'priya.d@example.com', branch: 'Nashik Branch', lockerType: 'Large', operationMode: 'Either or Survivor', nomineeName: 'Sanjay Deshmukh', status: '004 - Suspended' },
  { ...sampleRequest, customerNo: 'CUST-1005', customerName: 'Kabir Shah', mobileNo: '9765412345', email: 'kabir.shah@example.com', branch: 'Pune Main Branch', lockerType: 'Medium', operationMode: 'Joint', nomineeName: 'Nisha Shah', status: '002 - Operative' },
];
