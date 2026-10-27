import type { DeviceResetRecord } from '../types/deviceReset';

export const deviceResetDemo: DeviceResetRecord[] = [
  { customer: 'XXXXXX1176', branch: 'Branch 4', reason: 'Changed phone', by: 'Branch user', date: '12 Oct', status: 'completed' },
  { customer: 'XXXXXX9035', branch: 'Branch 2', reason: 'Lost or stolen phone', by: 'Bank admin', date: '11 Oct', status: 'completed' },
  { customer: 'XXXXXX2290', branch: 'Main branch', reason: 'App not working', by: 'Bank admin', date: '10 Oct', status: 'completed' },
  { customer: 'XXXXXX6613', branch: 'Branch 7', reason: 'Changed phone', by: 'Branch user', date: '10 Oct', status: 'in_review' },
  { customer: 'XXXXXX3307', branch: 'Branch 2', reason: 'Changed phone', by: 'Bank admin', date: '08 Oct', status: 'completed' },
];
