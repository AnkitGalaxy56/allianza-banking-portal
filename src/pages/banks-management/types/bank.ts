export type Bank = {
  id: string; code: string; name: string; type: string; sponsorBank: string;
  pan: string; cutOffTimings: string; branches: string; address: string;
  address1: string; address2: string; address3: string; city: string; state: string;
  pincode: string; sponsorAccountId: string; registrationLicense: string;
  ifsc: string; gst: string; workingFrom: string; workingTo: string; micr: string;
};
export type BankForm = Omit<Bank, 'id'>;
