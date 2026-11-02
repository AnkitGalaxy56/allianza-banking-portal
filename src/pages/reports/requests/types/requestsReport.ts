export interface RequestReportRow {
  id: string;
  requestId: string;
  requestType: string;
  customerName: string;
  customerNo: string;
  branch: string;
  submittedOn: string;
  processedOn: string;
  status: 'Completed' | 'Pending' | 'Failed';
  processedBy: string;
}

export interface RequestsReportFilterState {
  search: string;
  branch: string;
  status: string;
  fromDate: string;
  toDate: string;
}
