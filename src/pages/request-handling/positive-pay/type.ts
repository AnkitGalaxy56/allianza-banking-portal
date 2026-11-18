export type RequestStatus = 'Pending Review' | 'Approved' | 'Rejected';
export type PositivePayRequest = { id:string; branch:string; account:string; customer:string; chequeNo:string; chequeDate:string; amount:number; payee:string; remarks?:string; submitted:string; status:RequestStatus; accountType:string; declaration:boolean };
