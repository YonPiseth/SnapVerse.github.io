'use server';

/**
 * @fileOverview Generates a poem based on the analysis of a user-provided image.
 *
 * - generatePoemFromImage - A function that handles the poem generation process.
 * - GeneratePoemFromImageInput - The input type for the generatePoemFromImage function.
 * - GeneratePoemFromImageOutput - The return type for the generatePoemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePoemFromImageInput = z.infer<typeof GeneratePoemFromImageInputSchema>;

const GeneratePoemFromImageOutputSchema = z.object({
  poem: z.string().describe('A poem inspired by the image.'),
});
export type GeneratePoemFromImageOutput = z.infer<typeof GeneratePoemFromImageOutputSchema>;

export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemFromImagePrompt',
  input: {schema: GeneratePoemFromImageInputSchema},
  output: {schema: GeneratePoemFromImageOutputSchema},
  prompt: `You are a poet laureate, skilled at crafting evocative poems based on visual input.\nAnalyze the image and create a poem that captures its essence, mood, and key elements.\nConsider the colors, objects, and overall scene in the image.\n\nImage: {{media url=photoDataUri}}\n\nPoem:`,
});

const generatePoemFromImageFlow = ai.defineFlow(
  {
    name: 'generatePoemFromImageFlow',
    inputSchema: GeneratePoemFromImageInputSchema,
    outputSchema: GeneratePoemFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
