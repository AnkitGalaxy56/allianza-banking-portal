import type { BankForm } from '../types/bank';

export const bankFieldRows: { name: keyof BankForm; label: string; span?: number }[] = [
  { name: 'code', label: 'Bank Code' }, { name: 'name', label: 'Bank Name', span: 2 },
  { name: 'type', label: 'Bank Type' }, { name: 'registrationLicense', label: 'Registration License No.' },
  { name: 'sponsorBank', label: 'Sponsor Bank', span: 2 }, { name: 'ifsc', label: 'IFSC Code' },
  { name: 'pan', label: 'PAN No.' }, { name: 'gst', label: 'G.S.T. No.' },
  { name: 'cutOffTimings', label: 'Cut off timings' }, { name: 'micr', label: 'MICR Code' },
  { name: 'branches', label: 'No. of Branches' }, { name: 'address', label: 'Address' },
  { name: 'address1', label: 'Address1' }, { name: 'address2', label: 'Address2' },
  { name: 'address3', label: 'Address3' }, { name: 'city', label: 'City' },
  { name: 'state', label: 'State' }, { name: 'pincode', label: 'Pincode' },
  { name: 'sponsorAccountId', label: 'Sponsor Bank A/c ID', span: 2 },
];
