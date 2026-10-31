export type AccountStatusCode = '001' | '002' | '003' | '004' | '005';
export interface DepositRequest { id: string; status: AccountStatusCode; fields: Record<string, string>; }
