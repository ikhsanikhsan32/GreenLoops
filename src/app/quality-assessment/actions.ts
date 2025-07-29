'use server';

import {
  analyzeBriquetteQuality,
  type AnalyzeBriquetteQualityInput,
  type AnalyzeBriquetteQualityOutput,
} from '@/ai/flows/analyze-briquette-quality';

export type AnalysisResult = {
    data?: AnalyzeBriquetteQualityOutput;
    error?: string;
}

export async function getBriquetteQualityAnalysis(
  input: AnalyzeBriquetteQualityInput
): Promise<AnalysisResult> {
  if (!input.photoDataUri || !input.photoDataUri.startsWith('data:image/')) {
    return { error: 'Please upload a valid image file.' };
  }

  try {
    const result = await analyzeBriquetteQuality(input);
    return { data: result };
  } catch (error) {
    console.error("Error analyzing briquette quality:", error);
    return { error: 'Failed to analyze briquette quality. The AI model may be unavailable. Please try again later.' };
  }
}
