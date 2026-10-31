import type { AppImage, ImageForm } from '../types/image';

export const emptyForm: ImageForm = { name: '', type: 'Banner', path: '', size: 0, format: '', dimensions: '', altText: '', platform: 'Both', status: 'Active', previewUrl: '' };

export const initialImages: AppImage[] = [
  { id: 'img-001', name: 'Home Dashboard Banner', type: 'Banner', path: '/assets/mobile/home-dashboard-banner.png', size: 248 * 1024, format: 'PNG', dimensions: '1200 × 480', altText: 'Mobile banking dashboard promotional banner', platform: 'Both', status: 'Active', updatedAt: '2026-10-12', previewUrl: '' },
  { id: 'img-002', name: 'Allianza App Logo', type: 'App Logo', path: '/assets/mobile/allianza-logo.png', size: 42 * 1024, format: 'PNG', dimensions: '512 × 512', altText: 'Allianza mobile application logo', platform: 'Both', status: 'Active', updatedAt: '2026-10-08', previewUrl: '' },
  { id: 'img-003', name: 'Quick Transfer Icon', type: 'Icon', path: '/assets/mobile/quick-transfer.svg', size: 8 * 1024, format: 'SVG', dimensions: '96 × 96', altText: 'Quick money transfer icon', platform: 'Both', status: 'Active', updatedAt: '2026-10-03', previewUrl: '' },
  { id: 'img-004', name: 'Welcome Onboarding', type: 'Onboarding', path: '/assets/mobile/onboarding-welcome.webp', size: 316 * 1024, format: 'WEBP', dimensions: '1080 × 1440', altText: 'Welcome illustration for new mobile banking users', platform: 'Android', status: 'Inactive', updatedAt: '2026-09-28', previewUrl: '' },
];
