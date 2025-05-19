'use server';

/**
 * @fileOverview Generates a poem based on the analysis of a user-provided image.
 *
 * - imageToPoem - A function that handles the poem generation process.
 * - ImageToPoemInput - The input type for the imageToPoem function.
 * - ImageToPoemOutput - The return type for the imageToPoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageToPoemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageToPoemInput = z.infer<typeof ImageToPoemInputSchema>;

const ImageToPoemOutputSchema = z.object({
  poem: z.string().describe('A poem inspired by the image.'),
});
export type ImageToPoemOutput = z.infer<typeof ImageToPoemOutputSchema>;

export async function imageToPoem(input: ImageToPoemInput): Promise<ImageToPoemOutput> {
  return imageToPoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageToPoemPrompt',
  input: {schema: ImageToPoemInputSchema},
  output: {schema: ImageToPoemOutputSchema},
  prompt: `You are a poet laureate, skilled at crafting evocative poems based on visual input.\nAnalyze the image and create a poem that captures its essence, mood, and key elements.\nConsider the colors, objects, and overall scene in the image.\n\nImage: {{media url=photoDataUri}}\n\nPoem:`,
});

const imageToPoemFlow = ai.defineFlow(
  {
    name: 'imageToPoemFlow',
    inputSchema: ImageToPoemInputSchema,
    outputSchema: ImageToPoemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
