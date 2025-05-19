'use server';

import { z } from 'zod';

const FetchImageInputSchema = z.object({
  imageUrl: z.string().url('Invalid URL provided.'),
});

interface FetchImageOutput {
  success: boolean;
  dataUri?: string;
  error?: string;
}

export async function fetchImageAsDataUrl(
  imageUrl: string
): Promise<FetchImageOutput> {
  try {
    const validation = FetchImageInputSchema.safeParse({ imageUrl });
    if (!validation.success) {
      return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image. Status: ${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return {
        success: false,
        error: 'The fetched URL does not point to a valid image type.',
      };
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(imageBuffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64Data}`;

    return { success: true, dataUri };
  } catch (error) {
    console.error('Error fetching image as data URL:', error);
    if (error instanceof Error && error.message.includes('Invalid URL')) {
         return { success: false, error: 'Invalid URL provided.' };
    }
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the image.',
    };
  }
}
