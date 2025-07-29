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

export const PredictSorghumYieldInputSchema = z.object({
  soilPh: z.number().describe('The pH level of the soil.'),
  nitrogen: z.number().describe('The amount of nitrogen in the soil in kg/ha.'),
  plantingDensity: z.number().describe('The density of plants per hectare.'),
  sorghumVariety: z.string().describe('The variety of sorghum planted.'),
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
});
export type PredictSorghumYieldOutput = z.infer<
  typeof PredictSorghumYieldOutputSchema
>;
