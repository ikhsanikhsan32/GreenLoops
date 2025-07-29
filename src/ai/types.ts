import {z} from 'genkit';

export const AnalyzeBriquetteQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a biomass briquette, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeBriquetteQualityInput = z.infer<
  typeof AnalyzeBriquetteQualityInputSchema
>;

export const AnalyzeBriquetteQualityOutputSchema = z.object({
  qualityScore: z
    .number()
    .describe('A score between 0 and 1 indicating the quality of the briquette.'),
  qualityFactors: z
    .array(z.string())
    .describe('The factors affecting the quality of the briquette.'),
  suggestedPriceRange: z
    .string()
    .describe('The suggested price range for the briquette.'),
});
export type AnalyzeBriquetteQualityOutput = z.infer<
  typeof AnalyzeBriquetteQualityOutputSchema
>;

const BiomassAllocationSchema = z.object({
    grains: z.number().describe('Percentage of biomass allocated to grains for food.'),
    stalksAndLeaves: z.number().describe('Percentage of biomass allocated to stalks and leaves for briquettes.'),
    residualBiomass: z.number().describe('Percentage of biomass allocated to residual for bioethanol or fertilizer.'),
});


export const PredictSorghumYieldInputSchema = z.object({
  landArea: z.number().describe('The total land area in hectares.'),
  farmingTechnique: z.string().describe('The farming technique used (e.g., conventional, organic).'),
  plantingDistance: z.string().describe('The distance between plants (e.g., "75cm x 25cm").'),
  historicalHarvestData: z.array(z.number()).describe('An array of harvest data in tons per hectare for the last 5 years.'),
});
export type PredictSorghumYieldInput = z.infer<
  typeof PredictSorghumYieldInputSchema
>;

export const PredictSorghumYieldOutputSchema = z.object({
  predictedYield: z
    .number()
    .describe('The predicted yield in tons per hectare.'),
  historicalAverage: z
    .number()
    .describe(
      'The 5-year historical average yield for this variety in tons per hectare.'
    ),
  confidence: z
    .number()
    .describe('The confidence level of the prediction, from 0 to 1.'),
  biomassAllocation: BiomassAllocationSchema.describe('The breakdown of the biomass allocation.'),
});
export type PredictSorghumYieldOutput = z.infer<
  typeof PredictSorghumYieldOutputSchema
>;
