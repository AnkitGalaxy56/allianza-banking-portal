export type RequestStatus = 'Pending Review' | 'Approved' | 'Rejected';
export type KYCRequest = { id:string; customer:string; account:string; docs:string; submitted:string; stage:string; front:string; back:string; selfie:string; address?:string; status:RequestStatus };
