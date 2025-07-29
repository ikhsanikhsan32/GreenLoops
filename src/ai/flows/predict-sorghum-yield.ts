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
  - Land Area (ha): {{{landArea}}}
  - Farming Technique: {{{farmingTechnique}}}
  - Planting Distance: {{{plantingDistance}}}
  - Last 5 Years Harvest Data (t/ha): {{#each historicalHarvestData}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if satelliteImageUri}}
  - Satellite Image: {{media url=satelliteImageUri}}
  {{/if}}

  Also provide a 5-year historical average based on the provided data and a confidence score for your prediction.
  
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
