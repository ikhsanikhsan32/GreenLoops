// src/ai/flows/analyze-briquette-quality.ts
'use server';
/**
 * @fileOverview Analyzes the quality of a biomass briquette based on an image.
 *
 * - analyzeBriquetteQuality - A function that analyzes the briquette quality.
 * - AnalyzeBriquetteQualityInput - The input type for the analyzeBriquetteQuality function.
 * - AnalyzeBriquetteQualityOutput - The return type for the analyzeBriquetteQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBriquetteQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a biomass briquette, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeBriquetteQualityInput = z.infer<typeof AnalyzeBriquetteQualityInputSchema>;

const AnalyzeBriquetteQualityOutputSchema = z.object({
  qualityScore: z
    .number()
    .describe('A score between 0 and 1 indicating the quality of the briquette.'),
  qualityFactors: z.array(z.string()).describe('The factors affecting the quality of the briquette.'),
  suggestedPriceRange: z.string().describe('The suggested price range for the briquette.'),
});
export type AnalyzeBriquetteQualityOutput = z.infer<typeof AnalyzeBriquetteQualityOutputSchema>;

export async function analyzeBriquetteQuality(input: AnalyzeBriquetteQualityInput): Promise<AnalyzeBriquetteQualityOutput> {
  return analyzeBriquetteQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBriquetteQualityPrompt',
  input: {schema: AnalyzeBriquetteQualityInputSchema},
  output: {schema: AnalyzeBriquetteQualityOutputSchema},
  prompt: `You are an expert in biomass briquette quality assessment.

  Analyze the provided image of the briquette and provide a quality score, factors affecting the quality, and a suggested price range.

  Respond in JSON format.

  Photo: {{media url=photoDataUri}}`,
});

const analyzeBriquetteQualityFlow = ai.defineFlow(
  {
    name: 'analyzeBriquetteQualityFlow',
    inputSchema: AnalyzeBriquetteQualityInputSchema,
    outputSchema: AnalyzeBriquetteQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

