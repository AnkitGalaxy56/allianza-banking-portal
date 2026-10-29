import type { Bank, BankForm } from '../types/bank';

export const emptyForm: BankForm = {
  code: '', name: '', type: '', sponsorBank: '', pan: '', cutOffTimings: '', branches: '',
  address: '', address1: '', address2: '', address3: '', city: '', state: '', pincode: '',
  sponsorAccountId: '', registrationLicense: '', ifsc: '', gst: '', workingFrom: '', workingTo: '', micr: '',
};

export const demoBanks: Bank[] = [
  { id: 'bank-001', ...emptyForm, code: 'ALZ001', name: 'Allianza Demo Bank', type: 'Co-operative', sponsorBank: 'Allianza Sponsor Bank', pan: 'ABCDE1234F', cutOffTimings: '16:00', branches: '12', address: 'Main Road, Pune', address1: 'Shivaji Nagar', address2: '', address3: '', city: 'Pune', state: 'Maharashtra', pincode: '411005', sponsorAccountId: 'SB001234', registrationLicense: 'REG-2024-001', ifsc: 'ALZN0000001', gst: '27ABCDE1234F1Z5', workingFrom: '09:30', workingTo: '17:30', micr: '411002001' },
  { id: 'bank-002', ...emptyForm, code: 'ALZ002', name: 'Sample Urban Bank', type: 'Urban Co-operative', sponsorBank: 'Allianza Sponsor Bank', pan: 'FGHIJ5678K', cutOffTimings: '15:30', branches: '8', address: 'Station Road, Nashik', address1: '', address2: '', address3: '', city: 'Nashik', state: 'Maharashtra', pincode: '422001', sponsorAccountId: 'SB009876', registrationLicense: 'REG-2024-002', ifsc: 'ALZN0000002', gst: '27FGHIJ5678K1Z5', workingFrom: '10:00', workingTo: '17:00', micr: '422002001' },
];
