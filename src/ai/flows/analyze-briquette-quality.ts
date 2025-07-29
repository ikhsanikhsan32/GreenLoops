// src/ai/flows/analyze-briquette-quality.ts
'use server';
/**
 * @fileOverview Analyzes the quality of a biomass briquette based on an image.
 *
 * - analyzeBriquetteQuality - A function that analyzes the briquette quality.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeBriquetteQualityInputSchema,
  AnalyzeBriquetteQualityOutputSchema,
  type AnalyzeBriquetteQualityInput,
  type AnalyzeBriquetteQualityOutput,
} from '@/ai/types';

export async function analyzeBriquetteQuality(
  input: AnalyzeBriquetteQualityInput
): Promise<AnalyzeBriquetteQualityOutput> {
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
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
