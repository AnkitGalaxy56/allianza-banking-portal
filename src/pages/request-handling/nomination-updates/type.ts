export type RequestStatus = 'Pending Review' | 'Approved' | 'Rejected';
export type NominationRequest = { id:string; customer:string; account:string; nominee:string; relationship:string; dob?:string; mobile?:string; email?:string; address?:string; allocation?:number|string; guardian?:string; isMinor?:boolean; submitted:string; status:RequestStatus };
