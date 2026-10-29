import { z } from 'zod';

export const imageSchema = z.object({ name: z.string().trim().min(1, 'Image name is required.'), type: z.enum(['Banner', 'App Logo', 'Icon', 'Onboarding', 'Promotion', 'Other']), path: z.string().trim().min(1, 'Image path is required. Upload an image or enter its path.'), size: z.number().min(0), format: z.string(), dimensions: z.string(), altText: z.string(), platform: z.enum(['Android', 'iOS', 'Both']), status: z.enum(['Active', 'Inactive']), previewUrl: z.string(), });
export type ImageValues = z.infer<typeof imageSchema>;
