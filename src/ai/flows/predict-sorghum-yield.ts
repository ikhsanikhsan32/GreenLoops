'use server';
/**
 * @fileOverview Predicts sorghum yield based on input parameters.
 * 
 * - predictSorghumYield - A function that predicts sorghum yield.
 * - PredictSorghumYieldInput - The input type for the predictSorghumYield function.
 * - PredictSorghumYieldOutput - The return type for the predictSorghumYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PredictSorghumYieldInputSchema = z.object({
  soilPh: z.number().describe('The pH level of the soil.'),
  nitrogen: z.number().describe('The amount of nitrogen in the soil in kg/ha.'),
  plantingDensity: z.number().describe('The density of plants per hectare.'),
  sorghumVariety: z.string().describe('The variety of sorghum planted.'),
});
export type PredictSorghumYieldInput = z.infer<typeof PredictSorghumYieldInputSchema>;


export const PredictSorghumYieldOutputSchema = z.object({
  predictedYield: z.number().describe('The predicted yield in tons per hectare.'),
  historicalAverage: z.number().describe('The 5-year historical average yield for this variety in tons per hectare.'),
  confidence: z.number().describe('The confidence level of the prediction, from 0 to 1.'),
});
export type PredictSorghumYieldOutput = z.infer<typeof PredictSorghumYieldOutputSchema>;

export async function predictSorghumYield(input: PredictSorghumYieldInput): Promise<PredictSorghumYieldOutput> {
  return predictSorghumYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSorghumYieldPrompt',
  input: {schema: PredictSorghumYieldInputSchema},
  output: {schema: PredictSorghumYieldOutputSchema},
  prompt: `You are an expert agricultural AI specializing in sorghum yield prediction.

  Based on the following parameters, predict the sorghum yield in tons per hectare.
  - Soil pH: {{{soilPh}}}
  - Nitrogen (kg/ha): {{{nitrogen}}}
  - Planting Density (plants/ha): {{{plantingDensity}}}
  - Sorghum Variety: {{{sorghumVariety}}}

  Also provide a 5-year historical average for the specified variety and a confidence score for your prediction.
  
  Assume the following historical averages for the varieties:
  - Numbu: 3.4 t/ha
  - Super 1: 4.0 t/ha
  - Kawali: 3.7 t/ha

  Base your prediction on ideal conditions and adjust based on the provided parameters. For example, ideal soil pH for sorghum is between 6.0 and 7.5. Deviations from this range should negatively impact the yield. Similarly, optimal nitrogen levels are between 80-120 kg/ha.
  
  Respond in JSON format.`,
});

const predictSorghumYieldFlow = ai.defineFlow(
  {
    name: 'predictSorghumYieldFlow',
    inputSchema: PredictSorghumYieldInputSchema,
    outputSchema: PredictSorghumYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
