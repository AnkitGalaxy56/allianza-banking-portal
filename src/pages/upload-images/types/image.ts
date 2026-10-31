export type ImageType = 'Banner' | 'App Logo' | 'Icon' | 'Onboarding' | 'Promotion' | 'Other';
export type ImageStatus = 'Active' | 'Inactive';
export type AppImage = { id: string; name: string; type: ImageType; path: string; size: number; format: string; dimensions: string; altText: string; platform: 'Android' | 'iOS' | 'Both'; status: ImageStatus; updatedAt: string; previewUrl: string; };
export type ImageForm = Omit<AppImage, 'id' | 'updatedAt'>;
