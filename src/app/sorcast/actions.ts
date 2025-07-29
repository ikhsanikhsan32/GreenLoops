'use server';

import {
  predictSorghumYield,
} from '@/ai/flows/predict-sorghum-yield';
import type { PredictSorghumYieldInput, PredictSorghumYieldOutput } from '@/ai/types';

export type PredictionResult = {
    data?: PredictSorghumYieldOutput;
    error?: string;
}

export async function getYieldPrediction(
  input: PredictSorghumYieldInput
): Promise<PredictionResult> {
  try {
    const result = await predictSorghumYield(input);
    return { data: result };
  } catch (error) {
    console.error("Error predicting sorghum yield:", error);
    return { error: 'Failed to predict yield. The AI model may be unavailable. Please try again later.' };
  }
}
