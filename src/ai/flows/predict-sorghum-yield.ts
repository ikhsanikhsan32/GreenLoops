'use server';
/**
 * @fileOverview Predicts sorghum yield and biomass allocation based on input parameters.
 * 
 * - predictSorghumYield - A function that predicts sorghum yield and allocation.
 */

import {ai} from '@/ai/genkit';
import {
    PredictSorghumYieldInputSchema,
    PredictSorghumYieldOutputSchema,
    type PredictSorghumYieldInput,
    type PredictSorghumYieldOutput
} from '@/ai/types';

export async function predictSorghumYield(input: PredictSorghumYieldInput): Promise<PredictSorghumYieldOutput> {
  return predictSorghumYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSorghumYieldPrompt',
  input: {schema: PredictSorghumYieldInputSchema},
  output: {schema: PredictSorghumYieldOutputSchema},
  prompt: `You are an expert agricultural AI specializing in sorghum yield prediction, named Sorcast. Your goal is to predict yield and suggest biomass allocation.

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
  
  After predicting the total yield, classify the biomass into the following categories as percentages of the total yield:
  - Grains (for food): 30%
  - Stalks and Leaves (for briquettes): 50%
  - Residual Biomass (for bioethanol/fertilizer): 20%
  
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
